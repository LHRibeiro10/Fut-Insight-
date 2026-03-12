export function createSeedData() {
  const players = [
    {
      id: crypto.randomUUID(),
      name: 'Henry',
      position: 'ATA',
      overall: 92,
      club: 'Icons United',
      nation: 'França',
      preferredFoot: 'Direito',
      notes: 'Decisivo em contra-ataques.',
    },
    {
      id: crypto.randomUUID(),
      name: 'Ramires',
      position: 'VOL',
      overall: 89,
      club: 'WL Core',
      nation: 'Brasil',
      preferredFoot: 'Direito',
      notes: 'Recupera muitas bolas.',
    },
    {
      id: crypto.randomUUID(),
      name: 'Bastoni',
      position: 'ZAG',
      overall: 90,
      club: 'WL Core',
      nation: 'Itália',
      preferredFoot: 'Esquerdo',
      notes: 'Bom na saída curta.',
    },
    {
      id: crypto.randomUUID(),
      name: 'Donnarumma',
      position: 'GOL',
      overall: 91,
      club: 'WL Core',
      nation: 'Itália',
      preferredFoot: 'Direito',
      notes: 'Muito forte no mano a mano.',
    },
  ];

  const byName = Object.fromEntries(players.map((player) => [player.name, player.id]));

  const matches = [
    {
      id: crypto.randomUUID(),
      date: '2026-03-05',
      result: 'win',
      goalsFor: 4,
      goalsAgainst: 2,
      rankGoal: 11,
      rival: '4-2-3-1 pressão',
      formationUsed: '4-4-2',
      notes: 'Virei no segundo tempo.',
      players: [
        { playerId: byName.Henry, goals: 2, assists: 1, rating: 8.7, mvp: true, saves: 0 },
        { playerId: byName.Ramires, goals: 1, assists: 1, rating: 8.3, mvp: false, saves: 0 },
        { playerId: byName.Bastoni, goals: 0, assists: 0, rating: 7.4, mvp: false, saves: 0 },
        { playerId: byName.Donnarumma, goals: 0, assists: 0, rating: 8.1, mvp: false, saves: 6 },
      ],
    },
    {
      id: crypto.randomUUID(),
      date: '2026-03-05',
      result: 'loss',
      goalsFor: 2,
      goalsAgainst: 3,
      rankGoal: 11,
      rival: '5-4-1 contra',
      formationUsed: '4-2-1-3',
      notes: 'Errei saída curta no fim.',
      players: [
        { playerId: byName.Henry, goals: 1, assists: 0, rating: 7.8, mvp: false, saves: 0 },
        { playerId: byName.Ramires, goals: 0, assists: 1, rating: 7.5, mvp: false, saves: 0 },
        { playerId: byName.Bastoni, goals: 0, assists: 0, rating: 6.9, mvp: false, saves: 0 },
        { playerId: byName.Donnarumma, goals: 0, assists: 0, rating: 7.0, mvp: false, saves: 4 },
      ],
    },
    {
      id: crypto.randomUUID(),
      date: '2026-03-06',
      result: 'win',
      goalsFor: 3,
      goalsAgainst: 1,
      rankGoal: 11,
      rival: '4-3-2-1',
      formationUsed: '4-4-2',
      notes: 'Dominei a posse e chutei mais.',
      players: [
        { playerId: byName.Henry, goals: 1, assists: 1, rating: 8.5, mvp: false, saves: 0 },
        { playerId: byName.Ramires, goals: 1, assists: 0, rating: 8.2, mvp: true, saves: 0 },
        { playerId: byName.Bastoni, goals: 0, assists: 0, rating: 7.6, mvp: false, saves: 0 },
        { playerId: byName.Donnarumma, goals: 0, assists: 0, rating: 8.0, mvp: false, saves: 5 },
      ],
    },
  ];

  return { players, matches };
}
