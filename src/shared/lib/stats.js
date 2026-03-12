export function getDashboardStats(matches) {
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.result === 'win').length;
  const draws = matches.filter((match) => match.result === 'draw').length;
  const losses = matches.filter((match) => match.result === 'loss').length;
  const goalsFor = matches.reduce((acc, match) => acc + Number(match.goalsFor || 0), 0);
  const goalsAgainst = matches.reduce((acc, match) => acc + Number(match.goalsAgainst || 0), 0);
  const points = wins * 3 + draws;
  const winRate = totalMatches ? Math.round((wins / totalMatches) * 100) : 0;
  const currentTarget = Number(matches.at(-1)?.rankGoal || 11);
  const targetStatus = {
    target: currentTarget,
    remainingMatches: Math.max(0, 15 - totalMatches),
    winsNeeded: Math.max(0, currentTarget - wins),
    possible: wins + Math.max(0, 15 - totalMatches) >= currentTarget,
  };

  return {
    totalMatches,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    averageGoalsFor: totalMatches ? (goalsFor / totalMatches).toFixed(2) : '0.00',
    averageGoalsAgainst: totalMatches ? (goalsAgainst / totalMatches).toFixed(2) : '0.00',
    winRate,
    points,
    targetStatus,
  };
}

export function getPerMatchChart(matches) {
  return matches.map((match, index) => ({
    partida: index + 1,
    golsPro: Number(match.goalsFor || 0),
    golsContra: Number(match.goalsAgainst || 0),
  }));
}

export function getRatingTrend(matches) {
  return matches.map((match, index) => {
    const rows = match.players || [];
    const averageRating = rows.length
      ? rows.reduce((acc, player) => acc + Number(player.rating || 0), 0) / rows.length
      : 0;

    return {
      partida: index + 1,
      nota: Number(averageRating.toFixed(2)),
    };
  });
}

export function getRollingWinRate(matches, windowSize = 5) {
  return matches.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const chunk = matches.slice(start, index + 1);
    const wins = chunk.filter((match) => match.result === 'win').length;
    return {
      partida: index + 1,
      winRate: Math.round((wins / chunk.length) * 100),
    };
  });
}

export function getTopPerformers(players, matches) {
  const map = new Map(
    players.map((player) => [
      player.id,
      {
        player,
        goals: 0,
        assists: 0,
        mvps: 0,
        ratings: [],
      },
    ])
  );

  matches.forEach((match) => {
    (match.players || []).forEach((row) => {
      const entry = map.get(row.playerId);
      if (!entry) return;
      entry.goals += Number(row.goals || 0);
      entry.assists += Number(row.assists || 0);
      entry.mvps += row.mvp ? 1 : 0;
      entry.ratings.push(Number(row.rating || 0));
    });
  });

  const list = [...map.values()].map((entry) => ({
    ...entry,
    averageRating: entry.ratings.length
      ? Number((entry.ratings.reduce((acc, value) => acc + value, 0) / entry.ratings.length).toFixed(2))
      : 0,
  }));

  return {
    scorers: [...list].sort((a, b) => b.goals - a.goals).slice(0, 5),
    assistants: [...list].sort((a, b) => b.assists - a.assists).slice(0, 5),
    mvps: [...list].sort((a, b) => b.mvps - a.mvps).slice(0, 5),
    ratings: [...list].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5),
  };
}

export function getPlayerSnapshot(player, matches) {
  const rows = matches.flatMap((match) =>
    (match.players || []).filter((row) => row.playerId === player.id).map((row) => ({ ...row, match }))
  );

  const games = rows.length;
  const goals = rows.reduce((acc, row) => acc + Number(row.goals || 0), 0);
  const assists = rows.reduce((acc, row) => acc + Number(row.assists || 0), 0);
  const saves = rows.reduce((acc, row) => acc + Number(row.saves || 0), 0);
  const mvps = rows.filter((row) => row.mvp).length;
  const avgRating = games
    ? Number((rows.reduce((acc, row) => acc + Number(row.rating || 0), 0) / games).toFixed(2))
    : 0;

  return { games, goals, assists, saves, mvps, avgRating };
}

