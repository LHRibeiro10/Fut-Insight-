function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchPlayers(players = [], query = "", limit = 20) {
  const q = normalizeText(query);

  if (!q) return [];

  const results = players
    .map((player) => {
      const name = normalizeText(player?.name || "");
      const club = normalizeText(player?.club || "");
      const nation = normalizeText(player?.nation || "");
      const position = normalizeText(player?.position || "");

      let score = 0;

      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q)) score += 60;

      if (club.includes(q)) score += 25;
      if (nation.includes(q)) score += 15;
      if (position.includes(q)) score += 10;

      return {
        player,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.player);

  return results;
}
