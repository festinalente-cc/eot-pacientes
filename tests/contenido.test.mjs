// Salvaguardas de contenido del sitio de pacientes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    if (f.startsWith('.') || f === 'node_modules' || f === 'tests') return [];
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(html|js)$/.test(f) ? [p] : [];
  });
}
const pages = files(ROOT).map((p) => [p.replace(ROOT, ''), readFileSync(p, 'utf8')]);
const html = pages.filter(([p]) => p.endsWith('.html'));

const DRUGS = ['teprotumumab', 'tepezza', 'tocilizumab', 'actemra', 'rituximab', 'mabthera', 'micofenolato', 'mycophenol', 'metilprednisolona', 'methylprednisolone', 'prednisona', 'prednisolona', 'triamcinolona', 'ciclosporina', 'azatioprina', 'metotrexato', 'adalimumab', 'sirolimus', 'ciclofosfamida', 'colchicina', 'selenio', 'satralizumab', 'batoclimab', 'linsitinib', 'veligrotug', 'amgen', 'horizon'];

test('hay páginas que revisar', () => assert.ok(html.length >= 6));
test('ningún medicamento ni fabricante se nombra', () => {
  for (const [p, s] of pages) for (const d of DRUGS) assert.ok(!s.toLowerCase().includes(d), `${p} menciona "${d}"`);
});
test('ningún enlace al sitio de profesionales', () => {
  for (const [p, s] of pages) assert.ok(!/eot-profesionales/i.test(s), p);
});
test('todas las páginas llevan noindex y el aviso común', () => {
  for (const [p, s] of html) {
    assert.ok(s.includes('noindex'), p);
    assert.ok(s.includes('id="site-footer"') && s.includes('assets/js/site.js'), p);
  }
});
test('nada guarda ni envía datos, salvo la preferencia de tema', () => {
  for (const [p, s] of pages) {
    assert.ok(!/sessionStorage|fetch\(|XMLHttpRequest|action=|sendBeacon|document\.cookie|indexedDB/.test(s), p);
    if (p !== 'assets/js/theme.js') assert.ok(!/localStorage/.test(s), p);
  }
  const theme = pages.find(([p]) => p === 'assets/js/theme.js')[1];
  assert.ok(theme.includes("var KEY = 'tema'"));
  for (const call of theme.match(/localStorage\.\w+\(([^)]*)\)/g)) assert.ok(/\(KEY(, v)?\)/.test(call), call);
});
test('las señales de alarma están en la portada y en su página, con la línea 123', () => {
  const get = (name) => html.find(([p]) => p === name)[1];
  assert.ok(get('index.html').includes('class="emergency"'));
  assert.ok(get('senales/index.html').includes('class="emergency"') && get('senales/index.html').includes('123'));
});
