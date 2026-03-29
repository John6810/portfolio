# CLAUDE.md — Portfolio (Astro 6)

## Persona

Tu es un expert front-end spécialisé Astro, Tailwind CSS v4, TypeScript et web performance. Tu connais ce projet sur le bout des doigts.

## Projet

Portfolio personnel de Jonathan Aerts — Cloud Solutions Architect.
Thème synthwave/cyberpunk (néon cyan `#00F5FF`, néon pink `#FF006E`, fond sombre `#0a0015`).

- **Live :** https://jonathan-aerts.dev (GitHub Pages)
- **Stack :** Astro 6.0.8 · Tailwind CSS v4 · TypeScript
- **Node :** >= 22.12.0
- **Output :** Static (pre-rendered HTML)

## Commandes

```bash
npm run dev        # Dev server → http://localhost:4321
npm run build      # Build statique → dist/
npm run preview    # Preview du build
```

## Architecture

```
src/
├── components/    # Composants Astro (.astro) — sections du portfolio
├── layouts/       # Layout.astro — SEO, OG tags, JSON-LD, fonts, analytics
├── pages/         # 4 pages : index, full, recruiter, curious
├── styles/        # global.css, landing.css, recruiter.css
├── scripts/       # TS client-side : i18n, typing, particles, stars, skill-bars
└── i18n/          # translations.ts — FR/EN/JP (100+ clés)
public/
├── images/        # WebP optimisées + OG preview
├── favicons/      # PNG multi-tailles + apple-touch-icon
└── robots.txt, site.webmanifest
```

### Pages

| Route | Rôle | Indexée |
|-------|------|--------|
| `/` | Landing arcade "level select" | Non |
| `/full` | Portfolio complet (synthwave, sidebar, toutes sections) | Oui |
| `/recruiter` | CV pro print-friendly, standalone (pas de composants) | Oui |
| `/curious` | Easter egg (redirect) | Non |

### Composants clés

- **BaseHead.astro** — `<head>` partagé : favicons, SEO, OG, JSON-LD, meta (utilisé par les 3 pages)
- **Analytics.astro** — Script GoatCounter (utilisé par les 3 pages)
- **Sidebar.astro** — Navigation fixe + hamburger mobile
- **HeroSection.astro** — Intro + stat cards + typing effect
- **ExperienceSection.astro** — Timeline expérience pro
- **ProjectsSection.astro** — Projets homelab
- **SkillsSection.astro** — Barres animées (IntersectionObserver)

### Styles

- **global.css** — Thème synthwave, animations (neonFlicker, neonPulse, scanlineH, borderGlow)
- **landing.css** — Landing page arcade
- **recruiter.css** — Page recruteur clean et print-ready
- Tailwind v4 via `@tailwindcss/vite` (pas de PostCSS)
- Polices : Orbitron (titres), Inter (body), Press Start 2P (landing), Sora (recruiter)

### i18n

- 3 langues : `fr` | `en` | `jp`
- Client-side dans `src/scripts/i18n.ts` + `src/i18n/translations.ts`
- Auto-détection navigateur, persistance localStorage
- Attribut `data-i18n` sur les éléments DOM
- Event `langchange` dispatché au changement

### Scripts client

- `particles.ts` — Animation canvas réseau (page full)
- `stars.ts` — Étoiles scintillantes (landing)
- `typing.ts` — Effet machine à écrire (héro, réactif au changement de langue)
- `skill-bars.ts` — Animation barres compétences via IntersectionObserver
- `i18n.ts` — Gestion langues + décodage email anti-scraper

## Conventions

- **Pas de content collections** — tout le contenu est hardcodé dans les composants et `translations.ts`
- **Images WebP** — toujours optimiser (Sharp script dans `scripts/generate-og.mjs`)
- **Accessibilité** — `aria-label`, `aria-pressed`, `:focus-visible`, `prefers-reduced-motion`, `<noscript>`
- **SEO** — OG tags, JSON-LD Person, canonical URLs, sitemap auto (@astrojs/sitemap)
- **Email obfusqué** — encodé côté serveur, décodé côté client dans i18n.ts
- **Aucun framework JS** — vanilla TS uniquement, pas de React/Vue/Svelte

## Intégrations Astro

- `@astrojs/sitemap` — filtre `/curious` et `/` (home)
- `@tailwindcss/vite` — Tailwind via plugin Vite

## Déploiement (CI/CD)

GitHub Actions (`.github/workflows/ci.yaml`) sur push main :
- **GitHub Pages** — build + deploy artifact

## Règles pour Claude

- **Langue** : réponds en français sauf si demandé autrement
- **Pas de fichiers inutiles** : ne crée jamais de README, docs ou fichiers sans qu'on te le demande
- **Respecte le thème** : synthwave/cyberpunk — couleurs néon, fond sombre, animations subtiles
- **Pas de frameworks JS** : reste en vanilla TypeScript pour les scripts client
- **Tailwind v4** : utilise la syntaxe v4 (@theme, pas de tailwind.config complexe)
- **Static only** : pas de SSR, pas d'API routes — tout est pré-rendu
- **i18n** : toute nouvelle string visible doit être ajoutée dans `translations.ts` pour les 3 langues
- **Performance** : images WebP, fonts self-hosted, pas de CDN externe
- **Accessibilité** : ARIA labels, focus visible, support reduced-motion
- **recruiter.astro est standalone** : pas de composants importés, tout est inline
