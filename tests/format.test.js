import test from 'node:test';
import assert from 'node:assert/strict';

import { formatDate, getResultColor, getResultLabel } from '../src/shared/lib/format.js';

test('formatDate converte yyyy-mm-dd para dd/mm/yyyy', () => {
  assert.equal(formatDate('2026-03-10'), '10/03/2026');
  assert.equal(formatDate(''), '-');
  assert.equal(formatDate('10/03/2026'), '10/03/2026');
});

test('getResultLabel e getResultColor mapeiam resultados conhecidos', () => {
  assert.equal(getResultLabel('win'), 'Vitória');
  assert.equal(getResultLabel('draw'), 'Empate');
  assert.equal(getResultColor('loss'), 'error');
  assert.equal(getResultColor('unknown'), 'default');
});
