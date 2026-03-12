const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

function normalize(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function pickBestPlayer(players = [], wantedName = "", wantedClub = "") {
  if (!Array.isArray(players) || players.length === 0) return null;

  const wantedNameNorm = normalize(wantedName);
  const wantedClubNorm = normalize(wantedClub);

  const exact = players.find((p) => normalize(p?.strPlayer) === wantedNameNorm);
  if (exact) return exact;

  const sameClub = players.find(
    (p) =>
      normalize(p?.strPlayer).includes(wantedNameNorm) &&
      normalize(p?.strTeam) === wantedClubNorm
  );
  if (sameClub) return sameClub;

  const partial = players.find((p) =>
    normalize(p?.strPlayer).includes(wantedNameNorm)
  );
  if (partial) return partial;

  return players[0] || null;
}

function pickBestTeam(teams = [], wantedClub = "") {
  if (!Array.isArray(teams) || teams.length === 0) return null;

  const wantedClubNorm = normalize(wantedClub);

  const exact = teams.find((t) => normalize(t?.strTeam) === wantedClubNorm);
  if (exact) return exact;

  const partial = teams.find((t) =>
    normalize(t?.strTeam).includes(wantedClubNorm)
  );
  if (partial) return partial;

  return teams[0] || null;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados: ${response.status}`);
  }

  return response.json();
}

export async function autoFillCardAssets({ name, club, nation }) {
  const result = {
    photo: "",
    clubBadge: "",
    nationFlag: "",
  };

  try {
    const playerUrl = `${API_BASE}/searchplayers.php?p=${encodeURIComponent(name)}`;
    const playerData = await fetchJson(playerUrl);
    const bestPlayer = pickBestPlayer(playerData?.player, name, club);

    if (bestPlayer) {
      result.photo =
        bestPlayer?.strCutout ||
        bestPlayer?.strRender ||
        bestPlayer?.strThumb ||
        "";
    }
  } catch (error) {
    console.error("Erro ao buscar jogador:", error);
  }

  try {
    const teamUrl = `${API_BASE}/searchteams.php?t=${encodeURIComponent(club)}`;
    const teamData = await fetchJson(teamUrl);
    const bestTeam = pickBestTeam(teamData?.teams, club);

    if (bestTeam) {
      result.clubBadge = bestTeam?.strBadge || "";
    }
  } catch (error) {
    console.error("Erro ao buscar escudo:", error);
  }

  // Bandeira opcional: você pode continuar manual por enquanto.
  // Se depois quiser, eu te passo uma busca automática por país também.

  return {
    nation: nation || "",
    ...result,
  };
}