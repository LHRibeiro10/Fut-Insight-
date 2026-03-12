import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyAliases,
  buildSearchScore,
  levenshtein,
  normalizeText,
  pickBestMatch,
  searchPlayersLocally,
  similarityScore,
} from '../src/shared/lib/searchUtils.js';

const players = [
  { id: 1, name: 'Vinicius Jr.', club: 'Real Madrid', position: 'PE' },
  { id: 2, name: 'Kylian Mbappe', club: 'Paris Saint-Germain', position: 'ATA' },
  { id: 3, name: 'Erling Haaland', club: 'Manchester City', position: 'ATA' },
];

test('normalizeText remove acentos, pontuação e excesso de espaços', () => {
  assert.equal(normalizeText('  Vínicius, Jr.  '), 'vinicius jr');
});

test('applyAliases resolve apelidos de jogador, clube e país', () => {
  assert.equal(applyAliases('cr7', 'player'), 'cristiano ronaldo');
  assert.equal(applyAliases('barca', 'club'), 'barcelona');
  assert.equal(applyAliases('Brasil', 'country'), 'brazil');
});

test('levenshtein e similarityScore refletem proximidade textual', () => {
  assert.equal(levenshtein('gol', 'goal'), 1);
  assert.equal(similarityScore('Haaland', 'Haaland'), 1);
  assert.ok(similarityScore('Vinicius', 'Vini Jr') < similarityScore('Vini Jr', 'Vini'));
});

test('buildSearchScore pondera nome e clube para priorizar correspondência correta', () => {
  const bestScore = buildSearchScore({
    wantedName: 'Vini Jr',
    candidateName: 'Vinicius Jr.',
    wantedClub: 'Real',
    candidateClub: 'Real Madrid',
  });
  const weakScore = buildSearchScore({
    wantedName: 'Vini Jr',
    candidateName: 'Erling Haaland',
    wantedClub: 'Real',
    candidateClub: 'Manchester City',
  });

  assert.ok(bestScore > 0.9);
  assert.ok(weakScore < 0.5);
});

test('pickBestMatch retorna o item com melhor score acima do limiar', () => {
  const match = pickBestMatch(players, {
    wantedName: 'Mbappe',
    wantedClub: 'PSG',
    getName: (player) => player.name,
    getClub: (player) => player.club,
  });

  assert.equal(match?.id, 2);
  assert.equal(
    pickBestMatch(players, {
      wantedName: 'Jogador Inexistente',
      wantedClub: 'Clube Inexistente',
      getName: (player) => player.name,
      getClub: (player) => player.club,
      minScore: 0.9,
    }),
    null
  );
});

test('searchPlayersLocally encontra por nome, clube e posição', () => {
  assert.deepEqual(
    searchPlayersLocally(players, 'haaland').map((player) => player.id),
    [3]
  );
  assert.deepEqual(
    searchPlayersLocally(players, 'man city').map((player) => player.id),
    [3]
  );
  assert.deepEqual(
    searchPlayersLocally(players, 'ata').map((player) => player.id),
    [2, 3]
  );
});
