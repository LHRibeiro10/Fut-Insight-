const CLUB_ALIASES = {
  "real": "real madrid",
  "real madri": "real madrid",
  "rm": "real madrid",
  "barca": "barcelona",
  "psg": "paris saint-germain",
  "man city": "manchester city",
  "city": "manchester city",
  "man utd": "manchester united",
  "united": "manchester united",
  "inter milan": "inter",
  "atleti": "atlético madrid",
  "bayern munich": "bayern münchen",
};

const COUNTRY_ALIASES = {
  "brasil": "brazil",
  "brazil": "brazil",

  "franca": "france",
  "frança": "france",
  "france": "france",

  "inglaterra": "united kingdom",
  "england": "united kingdom",
  "reino unido": "united kingdom",
  "united kingdom": "united kingdom",

  "italia": "italy",
  "itália": "italy",
  "italy": "italy",

  "espanha": "spain",
  "espanhaa": "spain",
  "espanha ": "spain",
  "spain": "spain",

  "alemanha": "germany",
  "germany": "germany",

  "argentina": "argentina",
  "portugal": "portugal",

  "holanda": "netherlands",
  "netherlands": "netherlands",
  "paises baixos": "netherlands",
  "países baixos": "netherlands",

  "belgica": "belgium",
  "bélgica": "belgium",
  "belgium": "belgium",

  "marrocos": "morocco",
  "morocco": "morocco",

  "noruega": "norway",
  "norway": "norway",

  "uruguai": "uruguay",
  "uruguay": "uruguay",

  "egito": "egypt",
  "egypt": "egypt",

  "coreia do sul": "south korea",
  "coréia do sul": "south korea",
  "south korea": "south korea",

  "arabia saudita": "saudi arabia",
  "arábia saudita": "saudi arabia",
  "saudi arabia": "saudi arabia",

  "russia": "russia",
  "rússia": "russia",

  "estados unidos": "united states",
  "usa": "united states",
  "united states": "united states",

  "escocia": "scotland",
  "escócia": "scotland",
  "scotland": "scotland",

  "eslovenia": "slovenia",
  "eslovênia": "slovenia",
  "slovenia": "slovenia",

  "georgia": "georgia",
  "geórgia": "georgia",

  "nigeria": "nigeria",
  "nigéria": "nigeria",

  "polonia": "poland",
  "polônia": "poland",
  "poland": "poland",

  "finlandia": "finland",
  "finlândia": "finland",
  "finland": "finland",

  "hungria": "hungary",
  "hungary": "hungary",

  "bulgaria": "bulgaria",
  "bulgária": "bulgaria",

  "australia": "australia",
  "austrália": "australia",
  "australiaa": "australia",

  "costa do marfim": "ivory coast",
  "côte d'ivoire": "ivory coast",
  "ivory coast": "ivory coast",
};

const PLAYER_ALIASES = {
  "vini jr": "vinícius jr.",
  "vinicius": "vinícius jr.",
  "ronaldo": "cristiano ronaldo",
  "cr7": "cristiano ronaldo",
  "mbappe": "kylian mbappé",
  "haaland": "erling haaland",
};

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function applyAliases(value = "", type = "generic") {
  const normalized = normalizeText(value);

  if (type === "club") return CLUB_ALIASES[normalized] || normalized;
  if (type === "country") return COUNTRY_ALIASES[normalized] || normalized;
  if (type === "player") return PLAYER_ALIASES[normalized] || normalized;

  return normalized;
}

export function levenshtein(a = "", b = "") {
  const s = normalizeText(a);
  const t = normalizeText(b);

  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const rows = s.length + 1;
  const cols = t.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

export function similarityScore(a = "", b = "") {
  const s = normalizeText(a);
  const t = normalizeText(b);

  if (!s || !t) return 0;
  if (s === t) return 1;
  if (s.includes(t) || t.includes(s)) return 0.92;

  const distance = levenshtein(s, t);
  const maxLen = Math.max(s.length, t.length);

  return Math.max(0, 1 - distance / maxLen);
}

export function buildSearchScore({
  wantedName = "",
  candidateName = "",
  wantedClub = "",
  candidateClub = "",
}) {
  const playerScore = similarityScore(
    applyAliases(wantedName, "player"),
    applyAliases(candidateName, "player")
  );

  const clubScore = similarityScore(
    applyAliases(wantedClub, "club"),
    applyAliases(candidateClub, "club")
  );

  return playerScore * 0.75 + clubScore * 0.25;
}

export function pickBestMatch(items = [], config = {}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const scored = items
    .map((item) => ({
      item,
      score: buildSearchScore({
        wantedName: config.wantedName,
        candidateName: config.getName?.(item) || "",
        wantedClub: config.wantedClub,
        candidateClub: config.getClub?.(item) || "",
      }),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score >= (config.minScore ?? 0.45) ? scored[0].item : null;
}

export function searchPlayersLocally(players = [], query = "") {
  const wanted = applyAliases(query, "player");

  return [...players]
    .map((player) => ({
      player,
      score: Math.max(
        similarityScore(player?.name || "", wanted),
        similarityScore(player?.club || "", wanted),
        similarityScore(player?.position || "", wanted)
      ),
    }))
    .filter((item) => item.score >= 0.35)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.player);
}