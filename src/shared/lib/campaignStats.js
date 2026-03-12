export function getCampaignMatches(matches = [], campaignId = "") {
  const safeMatches = Array.isArray(matches) ? matches : [];

  if (!campaignId) {
    return safeMatches;
  }

  return safeMatches.filter((match) => match?.campaignId === campaignId);
}

export function getPlayerStatsForCampaign(
  players = [],
  matches = [],
  campaignId = ""
) {
  const safePlayers = Array.isArray(players) ? players : [];
  const filteredMatches = getCampaignMatches(matches, campaignId);

  const statsMap = new Map();

  safePlayers.forEach((player) => {
    statsMap.set(player.id, {
      player,
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      mvps: 0,
      saves: 0,
      totalRating: 0,
      ratingEntries: 0,
      averageRating: 0,
    });
  });

  filteredMatches.forEach((match) => {
    const rows = Array.isArray(match?.players) ? match.players : [];

    rows.forEach((row) => {
      if (!statsMap.has(row.playerId)) return;

      const current = statsMap.get(row.playerId);

      current.matchesPlayed += 1;
      current.goals += Number(row.goals || 0);
      current.assists += Number(row.assists || 0);
      current.mvps += row.mvp ? 1 : 0;
      current.saves += Number(row.saves || 0);

      if (row.rating !== "" && row.rating !== null && row.rating !== undefined) {
        current.totalRating += Number(row.rating || 0);
        current.ratingEntries += 1;
      }

      current.averageRating =
        current.ratingEntries > 0
          ? Number((current.totalRating / current.ratingEntries).toFixed(2))
          : 0;
    });
  });

  return Array.from(statsMap.values());
}

export function getCampaignSummary(players = [], matches = [], campaignId = "") {
  const filteredMatches = getCampaignMatches(matches, campaignId);
  const playerStats = getPlayerStatsForCampaign(players, matches, campaignId);

  const wins = filteredMatches.filter((match) => match?.result === "win").length;
  const losses = filteredMatches.filter((match) => match?.result === "loss").length;

  const goalsFor = filteredMatches.reduce(
    (acc, match) => acc + Number(match?.goalsFor || 0),
    0
  );

  const goalsAgainst = filteredMatches.reduce(
    (acc, match) => acc + Number(match?.goalsAgainst || 0),
    0
  );

  const totalMatches = filteredMatches.length;
  const winRateNumber = totalMatches ? (wins / totalMatches) * 100 : 0;
  const winRate = `${winRateNumber.toFixed(1)}%`;

  const avgGoalsFor = totalMatches ? (goalsFor / totalMatches).toFixed(2) : "0.00";
  const avgGoalsAgainst = totalMatches
    ? (goalsAgainst / totalMatches).toFixed(2)
    : "0.00";

  const goalDifference = goalsFor - goalsAgainst;

  const topScorer =
    [...playerStats].sort(
      (a, b) => b.goals - a.goals || b.matchesPlayed - a.matchesPlayed
    )[0] || null;

  const topAssist =
    [...playerStats].sort(
      (a, b) => b.assists - a.assists || b.matchesPlayed - a.matchesPlayed
    )[0] || null;

  const topMvp =
    [...playerStats].sort(
      (a, b) => b.mvps - a.mvps || b.matchesPlayed - a.matchesPlayed
    )[0] || null;

  const topAverageRating =
    [...playerStats]
      .filter((item) => item.ratingEntries > 0)
      .sort(
        (a, b) =>
          b.averageRating - a.averageRating ||
          b.matchesPlayed - a.matchesPlayed
      )[0] || null;

  const topKeeper =
    [...playerStats]
      .filter(
        (item) => (item.player?.position || "").toUpperCase() === "GOL"
      )
      .sort((a, b) => b.saves - a.saves || b.matchesPlayed - a.matchesPlayed)[0] ||
    null;

  const mostUsed =
    [...playerStats].sort(
      (a, b) => b.matchesPlayed - a.matchesPlayed || b.goals - a.goals
    )[0] || null;

  return {
    matches: filteredMatches,
    wins,
    losses,
    goalsFor,
    goalsAgainst,
    totalMatches,
    winRate,
    winRateNumber,
    avgGoalsFor,
    avgGoalsAgainst,
    goalDifference,
    topScorer,
    topAssist,
    topMvp,
    topAverageRating,
    topKeeper,
    mostUsed,
    playerStats,
  };
}
