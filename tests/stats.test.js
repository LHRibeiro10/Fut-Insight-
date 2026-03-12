import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getDashboardStats,
  getPerMatchChart,
  getPlayerSnapshot,
  getRatingTrend,
  getRollingWinRate,
  getTopPerformers,
} from '../src/utils/stats.js';

const players = [
  { id: 'p1', name: 'Henry' },
  { id: 'p2', name: 'Ramires' },
  { id: 'p3', name: 'Bastoni' },
];

const matches = [
  {
    result: 'win',
    goalsFor: 3,
    goalsAgainst: 1,
    rankGoal: 11,
    players: [
      { playerId: 'p1', goals: 2, assists: 1, rating: 8.5, mvp: true, saves: 0 },
      { playerId: 'p2', goals: 1, assists: 0, rating: 7.5, mvp: false, saves: 0 },
    ],
  },
  {
    result: 'draw',
    goalsFor: 2,
    goalsAgainst: 2,
    rankGoal: 13,
    players: [
      { playerId: 'p1', goals: 1, assists: 0, rating: 7.5, mvp: false, saves: 0 },
      { playerId: 'p2', goals: 0, assists: 1, rating: 8.0, mvp: true, saves: 0 },
      { playerId: 'p3', goals: 0, assists: 0, rating: 6.5, mvp: false, saves: 3 },
    ],
  },
  {
    result: 'loss',
    goalsFor: 0,
    goalsAgainst: 1,
    rankGoal: 13,
    players: [],
  },
];

test('getDashboardStats agrega resultados, médias e meta atual', () => {
  assert.deepEqual(getDashboardStats(matches), {
    totalMatches: 3,
    wins: 1,
    draws: 1,
    losses: 1,
    goalsFor: 5,
    goalsAgainst: 4,
    goalDiff: 1,
    averageGoalsFor: '1.67',
    averageGoalsAgainst: '1.33',
    winRate: 33,
    points: 4,
    targetStatus: {
      target: 13,
      remainingMatches: 12,
      winsNeeded: 12,
      possible: true,
    },
  });
});

test('getDashboardStats lida com lista vazia', () => {
  assert.equal(getDashboardStats([]).winRate, 0);
  assert.equal(getDashboardStats([]).averageGoalsFor, '0.00');
  assert.equal(getDashboardStats([]).targetStatus.target, 11);
});

test('getPerMatchChart e getRatingTrend convertem dados para gráficos', () => {
  assert.deepEqual(getPerMatchChart(matches), [
    { partida: 1, golsPro: 3, golsContra: 1 },
    { partida: 2, golsPro: 2, golsContra: 2 },
    { partida: 3, golsPro: 0, golsContra: 1 },
  ]);

  assert.deepEqual(getRatingTrend(matches), [
    { partida: 1, nota: 8 },
    { partida: 2, nota: 7.33 },
    { partida: 3, nota: 0 },
  ]);
});

test('getRollingWinRate calcula janela móvel corretamente', () => {
  assert.deepEqual(getRollingWinRate(matches, 2), [
    { partida: 1, winRate: 100 },
    { partida: 2, winRate: 50 },
    { partida: 3, winRate: 0 },
  ]);
});

test('getTopPerformers consolida ranking por métrica', () => {
  const top = getTopPerformers(players, matches);

  assert.equal(top.scorers[0].player.name, 'Henry');
  assert.equal(top.scorers[0].goals, 3);
  assert.equal(top.assistants[0].player.name, 'Henry');
  assert.equal(top.mvps[0].player.name, 'Henry');
  assert.equal(top.ratings[0].player.name, 'Henry');
  assert.equal(top.ratings[0].averageRating, 8);
});

test('getPlayerSnapshot resume partidas e contribuições individuais', () => {
  assert.deepEqual(getPlayerSnapshot(players[0], matches), {
    games: 2,
    goals: 3,
    assists: 1,
    saves: 0,
    mvps: 1,
    avgRating: 8,
  });
});
