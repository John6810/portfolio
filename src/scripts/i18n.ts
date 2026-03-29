import { T, type Lang } from '../i18n/translations';

const LANGS: Lang[] = ['fr', 'en', 'jp'];
let currentLang: Lang = 'fr';

export function getCurrentLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  const t = T[lang];
  if (!t) return;
  currentLang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && t[key]) el.textContent = t[key];
  });

  LANGS.forEach(l => {
    const btn = document.getElementById('btn-' + l);
    if (!btn) return;
    btn.classList.toggle('active-lang', l === lang);
    btn.setAttribute('aria-pressed', String(l === lang));
  });

  document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
  localStorage.setItem('preferred-lang', lang);
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

// Bind lang buttons via addEventListener (no inline onclick)
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang as Lang));
});

// Detect language from browser settings
function detectLang(): Lang {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) return 'jp';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('fr')) return 'fr';
  return 'en'; // fallback international
}

// Initialize: stored preference > browser language > fallback
const stored = localStorage.getItem('preferred-lang') as Lang | null;
setLang(stored && LANGS.includes(stored) ? stored : detectLang());

// Decode obfuscated email links (anti-scraper)
const em = ['hi', 'jonathan-aerts', 'dev'].join('@').replace(/@([^@]+)$/, '.$1');
document.querySelectorAll<HTMLAnchorElement>('[data-email]').forEach(a => {
  a.href = 'mailto:' + em;
  if (a.textContent?.includes('[email')) a.textContent = em;
});
document.querySelectorAll('[data-email-text]').forEach(el => {
  if (el.textContent?.includes('[email')) el.textContent = el.textContent.replace('✉️ [email protected]', '✉️ ' + em).replace('[email protected]', em);
});
