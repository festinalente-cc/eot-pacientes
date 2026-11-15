// Encabezado, navegación y pie comunes. Este sitio no enlaza al sitio de profesionales.
import { logoSmall, logoLarge } from './logo.js';
const root = document.body.dataset.root || './';
const page = document.body.dataset.page || '';
const NAV = [
  ['que-es', 'Qué es', 'que-es/'],
  ['senales', 'Señales de alarma', 'senales/'],
  ['consulta', 'Prepare su consulta', 'consulta/'],
  ['donde', 'Dónde consultar', 'donde/'],
  ['acerca', 'Acerca de', 'acerca/'],
];
const logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#06313a"/><circle cx="32" cy="32" r="23.5" fill="#22998f"/><circle cx="32" cy="32" r="14" fill="#2f6577" stroke="#e8b23a" stroke-width="2.5"/><circle cx="32" cy="32" r="7.5" fill="#05090a"/></svg>';
document.getElementById('site-header').innerHTML = `
  <div class="preview">Versión preliminar en revisión. No difundir.</div>
  <header class="site-header"><div class="container">
    <a class="brand" href="${root}">${logo}<span>Enfermedad ocular tiroidea<small>Información para pacientes y familias</small></span></a>
    <nav class="nav" aria-label="Principal">
      ${NAV.map(([id, label, href]) => `<a href="${root}${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <button type="button" class="theme-btn" id="theme-btn"></button>
  </div></header>`;
document.getElementById('site-footer').innerHTML = `
  <footer class="site-footer"><div class="container">
    <p><strong>Esta información es general y no reemplaza la consulta con su médico.</strong> No cambie ni suspenda ningún tratamiento sin hablar antes con su equipo de salud.</p>
    <p>Si pierde visión de repente, acuda a urgencias. Línea de emergencias en Colombia: 123.</p>
    <p>${logoSmall(16)}Grupo Colombiano de Enfermedad Ocular Tiroidea. Este sitio no recoge ni envía datos. <a href="${root}acerca/">Quiénes somos y cómo se financia</a>.</p>
  </div></footer>`;

// Selector de tema: sistema → claro → oscuro.
const THEMES = ['system', 'light', 'dark'];
const THEME_LABEL = { system: 'del sistema', light: 'claro', dark: 'oscuro' };
const themeBtn = document.getElementById('theme-btn');
function paintTheme() {
  const t = window.eotTheme ? window.eotTheme.get() : 'system';
  themeBtn.textContent = `Tema: ${THEME_LABEL[t]}`;
  themeBtn.setAttribute('aria-label', `Tema actual: ${THEME_LABEL[t]}. Pulse para cambiar.`);
}
themeBtn.addEventListener('click', () => {
  const t = window.eotTheme.get();
  window.eotTheme.set(THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
  paintTheme();
});
if (window.eotTheme) paintTheme(); else themeBtn.hidden = true;

const lockup = document.getElementById('gceot-lockup');
if (lockup) lockup.innerHTML = logoLarge(`${root}assets/img/iris-v2.webp`);
