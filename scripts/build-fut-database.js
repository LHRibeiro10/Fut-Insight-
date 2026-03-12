import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT = path.join(__dirname, "players.csv");
const OUTPUT = path.join(__dirname, "..", "src", "data", "futMiniDatabase.js");

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function normalizePosition(value = "") {
  const pos = String(value).toUpperCase().trim();

  const map = {
    ST: "ATA",
    CF: "ATA",
    LW: "PE",
    RW: "PD",
    CAM: "MEI",
    CM: "MC",
    CDM: "VOL",
    LM: "ME",
    RM: "MD",
    LB: "LE",
    RB: "LD",
    CB: "ZAG",
    GK: "GOL",
  };

  return map[pos] || pos || "MC";
}

function normalizeFoot(value = "") {
  const v = String(value).toLowerCase().trim();
  if (v.includes("left")) return "Esquerdo";
  if (v.includes("right")) return "Direito";
  return "Direito";
}

function safeNumber(value, fallback = 75) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function detectColumns(headers) {
  const lower = headers.map((h) => h.toLowerCase());

  function pick(...candidates) {
    return candidates.find((c) => lower.includes(c.toLowerCase())) || null;
  }

  return {
    id: pick("id", "sofifa_id", "player_id"),
    name: pick("name", "short_name", "long_name", "player_name"),
    overall: pick("overall", "overall_rating"),
    position: pick("player_positions", "best_position", "position"),
    nation: pick("nationality_name", "nationality", "nation"),
    club: pick("club_name", "club"),
    foot: pick("preferred_foot", "foot"),
  };
}

function main() {
  const raw = fs.readFileSync(INPUT, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);

  const headers = parseCSVLine(lines[0]);
  const cols = detectColumns(headers);

  const indexOf = (name) => headers.findIndex((h) => h.toLowerCase() === name?.toLowerCase());

  const indices = {
    id: indexOf(cols.id),
    name: indexOf(cols.name),
    overall: indexOf(cols.overall),
    position: indexOf(cols.position),
    nation: indexOf(cols.nation),
    club: indexOf(cols.club),
    foot: indexOf(cols.foot),
  };

  const players = lines.slice(1).map((line, rowIndex) => {
    const row = parseCSVLine(line);

    const rawPosition = row[indices.position] || "";
    const firstPosition = rawPosition.split(",")[0].trim();

    return {
      id: row[indices.id] || `player-${rowIndex + 1}`,
      name: row[indices.name] || "",
      overall: safeNumber(row[indices.overall], 75),
      position: normalizePosition(firstPosition),
      nation: row[indices.nation] || "",
      club: row[indices.club] || "",
      preferredFoot: normalizeFoot(row[indices.foot]),
      cardType: "gold",
      photo: "",
      clubBadge: "",
      nationFlag: "",
    };
  })
  .filter((p) => p.name);

  const output = `const futMiniDatabase = ${JSON.stringify(players, null, 2)};\n\nexport default futMiniDatabase;\n`;

  fs.writeFileSync(OUTPUT, output, "utf8");
  console.log(`Banco gerado com ${players.length} jogadores em ${OUTPUT}`);
}

main();