import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const dataDir = join(projectRoot, "server", "data");
const dbPath = join(dataDir, "fut-insight.sqlite");
const distDir = join(projectRoot, "dist");
const collections = ["players", "matches", "campaigns", "teams"];
const sessionCookieName = "fut_insight_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

let startedServer = null;

mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
`);

for (const table of collections) {
  ensureOwnerColumn(table);
}

function ensureOwnerColumn(table) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  const hasOwnerId = columns.some((column) => column.name === "owner_id");

  if (!hasOwnerId) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN owner_id TEXT`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_${table}_owner_id ON ${table}(owner_id)`);
  }
}

function json(data, statusCode = 200, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
    body: JSON.stringify(data),
  };
}

function text(body, statusCode = 200, contentType = "text/plain; charset=utf-8", extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": contentType,
      ...extraHeaders,
    },
    body,
  };
}

function parseRequestBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolveBody({});
        return;
      }

      try {
        resolveBody(JSON.parse(raw));
      } catch {
        rejectBody(createHttpError(400, "invalid-json"));
      }
    });

    req.on("error", rejectBody);
  });
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getResponseHeaders(req, extraHeaders = {}) {
  const origin = req.headers.origin;
  const allowOrigin = origin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
    ...extraHeaders,
  };
}

function parseRow(row) {
  if (!row) return null;
  return JSON.parse(row.payload);
}

function listItems(table, ownerId) {
  const statement = db.prepare(`
    SELECT payload
    FROM ${table}
    WHERE owner_id = ?
    ORDER BY created_at ASC, id ASC
  `);

  return statement.all(ownerId).map(parseRow);
}

function getItem(table, id, ownerId) {
  const statement = db.prepare(`
    SELECT payload
    FROM ${table}
    WHERE id = ? AND owner_id = ?
  `);

  return parseRow(statement.get(id, ownerId));
}

function saveItem(table, item, ownerId) {
  if (!item || typeof item !== "object") {
    throw createHttpError(400, "invalid-payload");
  }

  if (!item.id || typeof item.id !== "string") {
    throw createHttpError(400, "missing-id");
  }

  const now = new Date().toISOString();
  const payload = JSON.stringify(item);

  const statement = db.prepare(`
    INSERT INTO ${table} (id, payload, created_at, updated_at, owner_id)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at,
      owner_id = excluded.owner_id
  `);

  statement.run(item.id, payload, now, now, ownerId);
  return item;
}

function deleteItem(table, id, ownerId) {
  const statement = db.prepare(`
    DELETE FROM ${table}
    WHERE id = ? AND owner_id = ?
  `);

  statement.run(id, ownerId);
}

function replaceCollection(table, items, ownerId) {
  const deleteStatement = db.prepare(`DELETE FROM ${table} WHERE owner_id = ?`);
  deleteStatement.run(ownerId);

  const insertStatement = db.prepare(`
    INSERT INTO ${table} (id, payload, created_at, updated_at, owner_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const safeItems = Array.isArray(items) ? items : [];

  for (const item of safeItems) {
    if (!item?.id) continue;
    insertStatement.run(item.id, JSON.stringify(item), now, now, ownerId);
  }
}

function getDataset(ownerId) {
  return {
    players: listItems("players", ownerId),
    matches: listItems("matches", ownerId),
    campaigns: listItems("campaigns", ownerId),
    savedTeams: listItems("teams", ownerId),
  };
}

function restoreDataset(data, ownerId) {
  const dataset = {
    players: Array.isArray(data?.players) ? data.players : [],
    matches: Array.isArray(data?.matches) ? data.matches : [],
    campaigns: Array.isArray(data?.campaigns) ? data.campaigns : [],
    teams: Array.isArray(data?.savedTeams)
      ? data.savedTeams
      : Array.isArray(data?.teams)
        ? data.teams
        : [],
  };

  db.exec("BEGIN");

  try {
    replaceCollection("players", dataset.players, ownerId);
    replaceCollection("matches", dataset.matches, ownerId);
    replaceCollection("campaigns", dataset.campaigns, ownerId);
    replaceCollection("teams", dataset.teams, ownerId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return getDataset(ownerId);
}

function removeCampaignMatches(campaignId, ownerId) {
  const matches = listItems("matches", ownerId).filter((match) => match?.campaignId !== campaignId);
  replaceCollection("matches", matches, ownerId);
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function validatePassword(password = "") {
  return typeof password === "string" && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, stored] = String(storedHash || "").split(":");
  if (!salt || !stored) return false;

  const computed = scryptSync(password, salt, 64);
  const original = Buffer.from(stored, "hex");

  if (computed.length !== original.length) {
    return false;
  }

  return timingSafeEqual(computed, original);
}

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function stripUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt || user.created_at,
  };
}

function getUserByEmail(email) {
  return db.prepare(`
    SELECT
      id,
      name,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE email = ?
  `).get(normalizeEmail(email));
}

function getUserById(id) {
  return db.prepare(`
    SELECT
      id,
      name,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE id = ?
  `).get(id);
}

function createUser({ name, email, password }) {
  const normalizedName = String(name || "").trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName) {
    throw createHttpError(400, "Nome obrigatorio.");
  }

  if (!validateEmail(normalizedEmail)) {
    throw createHttpError(400, "Email invalido.");
  }

  if (!validatePassword(password)) {
    throw createHttpError(400, "A senha deve ter ao menos 8 caracteres, com letra e numero.");
  }

  if (getUserByEmail(normalizedEmail)) {
    throw createHttpError(409, "Email ja cadastrado.");
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user.id, user.name, user.email, user.passwordHash, user.createdAt, user.updatedAt);

  return user;
}

function createSession(userId) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + sessionDurationMs).toISOString();

  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(randomUUID(), userId, tokenHash, now, expiresAt);

  return {
    token,
    expiresAt,
  };
}

function deleteSessionByToken(token) {
  if (!token) return;

  db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(hashSessionToken(token));
}

function getUserFromSessionToken(token) {
  if (!token) {
    return null;
  }

  db.prepare(`DELETE FROM sessions WHERE expires_at <= ?`).run(new Date().toISOString());

  return db.prepare(`
    SELECT
      users.id,
      users.name,
      users.email,
      users.created_at AS createdAt
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(hashSessionToken(token), new Date().toISOString());
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) return acc;

      const key = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  return cookies[sessionCookieName] || "";
}

function createSessionCookie(token, expiresAt) {
  const maxAge = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  return `${sessionCookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(maxAge, 0)}`;
}

function clearSessionCookie() {
  return `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function requireAuth(req) {
  const token = getSessionTokenFromRequest(req);
  const user = getUserFromSessionToken(token);

  if (!user) {
    throw createHttpError(401, "Nao autenticado.");
  }

  return user;
}

function hasAnyOwnedData(ownerId) {
  return collections.some((table) => {
    const row = db.prepare(`SELECT 1 FROM ${table} WHERE owner_id = ? LIMIT 1`).get(ownerId);
    return Boolean(row);
  });
}

function hasLegacyData() {
  return collections.some((table) => {
    const row = db.prepare(`SELECT 1 FROM ${table} WHERE owner_id IS NULL LIMIT 1`).get();
    return Boolean(row);
  });
}

function claimLegacyDataIfNeeded(ownerId) {
  if (hasAnyOwnedData(ownerId) || !hasLegacyData()) {
    return;
  }

  db.exec("BEGIN");

  try {
    for (const table of collections) {
      db.prepare(`UPDATE ${table} SET owner_id = ? WHERE owner_id IS NULL`).run(ownerId);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function getMimeType(filePath) {
  const extension = extname(filePath).toLowerCase();

  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".js") return "application/javascript; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".json") return "application/json; charset=utf-8";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".ico") return "image/x-icon";
  return "application/octet-stream";
}

function serveStatic(reqPath, req) {
  if (!existsSync(distDir)) {
    return text("Frontend build not found.", 404, "text/plain; charset=utf-8", getResponseHeaders(req));
  }

  const relativePath = reqPath === "/" ? "index.html" : reqPath.slice(1);
  const normalizedPath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(distDir, normalizedPath);
  const safePath = filePath.startsWith(distDir) ? filePath : join(distDir, "index.html");
  const targetPath = existsSync(safePath) ? safePath : join(distDir, "index.html");

  return text(readFileSync(targetPath), 200, getMimeType(targetPath), getResponseHeaders(req));
}

async function handleAuthRoutes(req, url) {
  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    const token = getSessionTokenFromRequest(req);
    const user = getUserFromSessionToken(token);

    return json({ user: stripUser(user) }, 200, getResponseHeaders(req));
  }

  if (url.pathname === "/api/auth/register" && req.method === "POST") {
    const body = await parseRequestBody(req);
    const name = String(body?.name || "").trim();
    const email = normalizeEmail(body?.email || "");
    const password = String(body?.password || "");
    const confirmPassword = String(body?.confirmPassword || "");

    if (!name || !email || !password || !confirmPassword) {
      throw createHttpError(400, "Preencha todos os campos obrigatorios.");
    }

    if (password !== confirmPassword) {
      throw createHttpError(400, "As senhas nao conferem.");
    }

    const user = createUser({ name, email, password });
    claimLegacyDataIfNeeded(user.id);
    const session = createSession(user.id);

    return json(
      { user: stripUser(user) },
      201,
      getResponseHeaders(req, {
        "Set-Cookie": createSessionCookie(session.token, session.expiresAt),
      })
    );
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    const body = await parseRequestBody(req);
    const email = normalizeEmail(body?.email || "");
    const password = String(body?.password || "");

    if (!email || !password) {
      throw createHttpError(400, "Email e senha sao obrigatorios.");
    }

    const user = getUserByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw createHttpError(401, "Credenciais invalidas.");
    }

    claimLegacyDataIfNeeded(user.id);
    const session = createSession(user.id);

    return json(
      { user: stripUser(user) },
      200,
      getResponseHeaders(req, {
        "Set-Cookie": createSessionCookie(session.token, session.expiresAt),
      })
    );
  }

  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    deleteSessionByToken(getSessionTokenFromRequest(req));

    return json(
      { ok: true },
      200,
      getResponseHeaders(req, {
        "Set-Cookie": clearSessionCookie(),
      })
    );
  }

  return null;
}

async function handleApi(req) {
  const url = new URL(req.url, "http://127.0.0.1");
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (req.method === "OPTIONS") {
    return json({}, 204, getResponseHeaders(req));
  }

  if (url.pathname === "/api/health") {
    return json({ ok: true, dbPath }, 200, getResponseHeaders(req));
  }

  if (url.pathname.startsWith("/api/auth/")) {
    const authResponse = await handleAuthRoutes(req, url);
    if (authResponse) return authResponse;
    return json({ error: "not-found" }, 404, getResponseHeaders(req));
  }

  const user = requireAuth(req);

  if (url.pathname === "/api/bootstrap" || url.pathname === "/api/backup") {
    return json(getDataset(user.id), 200, getResponseHeaders(req));
  }

  if (url.pathname === "/api/restore" && req.method === "POST") {
    const body = await parseRequestBody(req);
    return json(restoreDataset(body, user.id), 200, getResponseHeaders(req));
  }

  if (pathParts[0] !== "api" || !collections.includes(pathParts[1])) {
    return json({ error: "not-found" }, 404, getResponseHeaders(req));
  }

  const table = pathParts[1] === "teams" ? "teams" : pathParts[1];
  const id = pathParts[2];

  if (req.method === "GET" && !id) {
    return json(listItems(table, user.id), 200, getResponseHeaders(req));
  }

  if (req.method === "GET" && id) {
    const item = getItem(table, id, user.id);
    return item
      ? json(item, 200, getResponseHeaders(req))
      : json({ error: "not-found" }, 404, getResponseHeaders(req));
  }

  if (req.method === "POST") {
    const body = await parseRequestBody(req);
    return json(saveItem(table, body, user.id), 201, getResponseHeaders(req));
  }

  if (req.method === "PUT" && id) {
    const body = await parseRequestBody(req);
    return json(saveItem(table, { ...body, id }, user.id), 200, getResponseHeaders(req));
  }

  if (req.method === "DELETE" && id) {
    if (table === "campaigns") {
      removeCampaignMatches(id, user.id);
    }

    deleteItem(table, id, user.id);
    return json({ ok: true }, 200, getResponseHeaders(req));
  }

  return json({ error: "method-not-allowed" }, 405, getResponseHeaders(req));
}

export function startServer({ port = 3001 } = {}) {
  if (startedServer) {
    return Promise.resolve(startedServer);
  }

  startedServer = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://127.0.0.1");
      const response = url.pathname.startsWith("/api")
        ? await handleApi(req)
        : serveStatic(url.pathname, req);

      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      const statusCode = error?.statusCode || 500;
      const response = json(
        {
          error: statusCode === 500 ? "server-error" : "request-error",
          message: error?.message || "Unexpected server error",
        },
        statusCode,
        getResponseHeaders(req)
      );

      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    }
  });

  return new Promise((resolveServer, rejectServer) => {
    startedServer.once("error", (error) => {
      if (error?.code === "EADDRINUSE") {
        resolveServer(startedServer);
        return;
      }

      rejectServer(error);
    });

    startedServer.listen(port, "127.0.0.1", () => {
      resolveServer(startedServer);
    });
  });
}

export function getDatabasePath() {
  return dbPath;
}
