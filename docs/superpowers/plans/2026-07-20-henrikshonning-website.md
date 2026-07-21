# Henriks Honning — statisk hjemmeside · Implementeringsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Byg en moderne, statisk hjemmeside for Henriks Honning med 7 danske artikler om honningbier, natur og biodiversitet, håndtegnede da Vinci-illustrationer i SVG, og automatisk deploy til GitHub Pages.

**Architecture:** Eleventy (11ty) v3 som statisk site-generator. Indhold skrives som Markdown/Nunjucks; layouts og genbrugelige dele (nav, footer, statbånd, årshjul, SVG-illustrationer) ligger som Nunjucks-partials. Ét håndskrevet CSS-stylesheet implementerer designet fra den godkendte mockup v4. Fonte er self-hostede. GitHub Actions bygger og udgiver `_site/` til GitHub Pages ved hvert push til `main`.

**Tech Stack:** Node.js, Eleventy v3 (`@11ty/eleventy`), `@11ty/eleventy-plugin-rss`, `@11ty/eleventy-img`, Nunjucks, ren CSS, vanilla JS (~20 linjer), GitHub Actions.

**Referencer:**
- Spec: `docs/superpowers/specs/2026-07-20-henrikshonning-website-design.md`
- Godkendt visuel mockup (reference for CSS/SVG — ligger i gitignored `.superpowers/`): `.superpowers/brainstorm/647-1784579847/content/design-mockup-v4.html`

**Verifikationsfilosofi:** Dette er en statisk site uden forretningslogik at unit-teste. "Test"-trin er derfor byggeverifikation (Eleventy bygger uden fejl), output-assertions (grep i det byggede `_site/` for forventet HTML) og eksplicit manuel visuel gennemgang. Nøgletal i tekst/statbånd verificeres mod kilder, før de skrives.

---

## Filstruktur

```
HenriksHonning/
├── package.json                     # Task 1
├── eleventy.config.js               # Task 2, 5, 6, 9, 11
├── .gitignore                       # findes (opdateres Task 1)
├── content/
│   ├── _data/
│   │   └── metadata.js              # Task 3 — sidens globale metadata
│   ├── index.njk                    # Task 7 — forside
│   ├── om.md                        # Task 8 — Om/kontakt
│   ├── 404.njk                      # Task 10 — 404-side
│   ├── feed.njk                     # Task 9 — RSS
│   └── artikler/
│       ├── artikler.json            # Task 4 — mappe-data (layout + tag)
│       ├── 01-honningbiens-liv.md         # Task 12
│       ├── 02-bierne-og-biodiversiteten.md# Task 13
│       ├── 03-en-bivenlig-have.md         # Task 14
│       ├── 04-mange-slags-honning.md      # Task 15
│       ├── 05-baeredygtige-foedevare.md   # Task 16
│       ├── 06-aaret-i-bigaarden.md        # Task 17
│       └── 07-fra-blomst-til-glas.md      # Task 18
├── _includes/
│   ├── layouts/
│   │   ├── base.njk                 # Task 5 — HTML-skelet, nav, footer
│   │   ├── artikel.njk              # Task 11 — artikel-skabelon
│   │   └── side.njk                 # Task 8 — statisk side
│   └── partials/
│       ├── nav.njk                  # Task 5
│       ├── footer.njk               # Task 5
│       ├── statband.njk             # Task 7
│       ├── aarshjul.njk             # Task 7
│       └── illustrationer/
│           ├── vitruviansk-bi.njk   # Task 7
│           ├── kloever-studie.njk   # Task 7
│           ├── halmkube.njk         # Task 7
│           └── celle-geometri.njk   # Task 7
├── assets/
│   ├── css/site.css                 # Task 6
│   ├── js/reveal.js                 # Task 6
│   ├── fonts/                       # Task 6 — self-hostede woff2
│   └── img/                         # Task 12+ — artikelfotos
└── .github/workflows/deploy.yml     # Task 19
```

---

## Task 1: Projektopsætning og afhængigheder

**Files:**
- Create: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Opret package.json**

Create `package.json`:

```json
{
  "name": "henrikshonning",
  "version": "1.0.0",
  "description": "Henriks Honning — statisk hjemmeside om hobbybiavl, honningbier og biodiversitet",
  "type": "module",
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
  },
  "license": "MIT",
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "@11ty/eleventy-img": "^6.0.0",
    "@11ty/eleventy-plugin-rss": "^2.0.2"
  }
}
```

- [ ] **Step 2: Installer afhængigheder**

Run: `npm install`
Expected: `node_modules/` oprettes, ingen fejl, `@11ty/eleventy` v3.x installeres.

- [ ] **Step 3: Sikr .gitignore dækker build-output**

Bekræft at `.gitignore` indeholder `_site/`, `node_modules/` og `.superpowers/`. Tilføj linjer der mangler (filen findes fra spec-committen). Endelig fil skal mindst indeholde:

```
_site/
node_modules/
.superpowers/
```

- [ ] **Step 4: Verificér tom build kører**

Run: `npx @11ty/eleventy --version`
Expected: Udskriver versionsnummer (3.x), ingen fejl.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: projektopsætning med Eleventy v3"
```

---

## Task 2: Minimal Eleventy-konfiguration og første build

**Files:**
- Create: `eleventy.config.js`
- Create: `content/index.njk` (midlertidig placeholder — erstattes i Task 7)

- [ ] **Step 1: Opret eleventy.config.js med mappestruktur**

Create `eleventy.config.js`:

```js
export default function (eleventyConfig) {
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
```

- [ ] **Step 2: Opret midlertidig forside**

Create `content/index.njk`:

```njk
<!doctype html>
<html lang="da"><head><meta charset="utf-8"><title>Henriks Honning</title></head>
<body><h1>Henriks Honning — under opbygning</h1></body></html>
```

- [ ] **Step 3: Byg og verificér output**

Run: `npx @11ty/eleventy`
Expected: `_site/index.html` oprettes; konsollen viser "1 file written".

- [ ] **Step 4: Bekræft indhold i output**

Run: `grep -c "under opbygning" _site/index.html`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add eleventy.config.js content/index.njk
git commit -m "chore: minimal Eleventy-konfiguration og placeholder-forside"
```

---

## Task 3: Globale metadata

**Files:**
- Create: `content/_data/metadata.js`

- [ ] **Step 1: Opret metadata-datafil**

Create `content/_data/metadata.js`:

```js
export default {
  title: "Henriks Honning",
  tagline: "Bierne & den danske natur",
  description:
    "Artikler om honningbier, natur og biodiversitet — fra en bigård på en skovejendom ved Hinge.",
  language: "da",
  // OPDATERES når endeligt domæne er valgt. Bruges kun til absolutte URL'er i RSS.
  url: "https://henrikkjaernielsen.github.io/HenriksHonning/",
  author: {
    name: "Henrik Kjær Nielsen",
    email: "henrikkjaernielsen@hotmail.com",
  },
  address: "Vinderslevholmvej 57, 8620 Kjellerup",
  since: 2014,
};
```

- [ ] **Step 2: Verificér data er tilgængeligt i skabeloner**

Rediger midlertidigt `content/index.njk` linje med `<h1>` til: `<h1>{{ metadata.title }} — {{ metadata.tagline }}</h1>` og kør `npx @11ty/eleventy`.
Run: `grep -c "Bierne & den danske natur" _site/index.html`
Expected: `1`. Gendan derefter `<h1>`-linjen til placeholder-teksten fra Task 2 (index.njk erstattes helt i Task 7).

- [ ] **Step 3: Commit**

```bash
git add content/_data/metadata.js content/index.njk
git commit -m "feat: globale metadata for sitet"
```

---

## Task 4: Artikel-collection og læsetid-filter

**Files:**
- Create: `content/artikler/artikler.json`
- Modify: `eleventy.config.js`

- [ ] **Step 1: Opret mappe-data for artikler**

Create `content/artikler/artikler.json` (giver alle artikler samme layout + tag):

```json
{
  "layout": "layouts/artikel.njk",
  "tags": "artikler"
}
```

- [ ] **Step 2: Tilføj læsetid-filter og sorteret collection i config**

Modify `eleventy.config.js` — tilføj inde i `export default function (eleventyConfig) {`, før `return {`:

```js
  // Læsetid i minutter ud fra ordantal (≈180 ord/min for dansk brødtekst)
  eleventyConfig.addFilter("laesetid", (content) => {
    const tekst = String(content).replace(/<[^>]*>/g, " ");
    const ord = tekst.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(ord / 180));
  });

  // Artikler sorteret ældste-først; nummer tildeles i skabelonen ud fra rækkefølge
  eleventyConfig.addCollection("artiklerSorteret", (collectionApi) => {
    return collectionApi.getFilteredByTag("artikler").sort((a, b) => a.date - b.date);
  });
```

- [ ] **Step 3: Verificér config stadig bygger**

Run: `npx @11ty/eleventy`
Expected: Bygger uden fejl (ingen artikler endnu, så collection er tom — det er OK).

- [ ] **Step 4: Commit**

```bash
git add content/artikler/artikler.json eleventy.config.js
git commit -m "feat: artikel-collection og læsetid-filter"
```

---

## Task 5: Base-layout med nav og footer

**Files:**
- Create: `_includes/layouts/base.njk`
- Create: `_includes/partials/nav.njk`
- Create: `_includes/partials/footer.njk`

- [ ] **Step 1: Opret nav-partial**

Create `_includes/partials/nav.njk` (SVG-logo og menu fra mockup v4):

```njk
<nav>
  <a class="brand" href="/">
    <svg width="34" height="38" viewBox="0 0 34 38" aria-hidden="true">
      <path d="M17 1 32.6 10v18L17 37 1.4 28V10Z" fill="none" stroke="#d9921e" stroke-width="2"/>
      <path d="M17 8.5 26 13.7v10.6L17 29.5 8 24.3V13.7Z" fill="#d9921e" opacity=".18"/>
      <text x="17" y="24" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="14" font-style="italic" font-weight="600" fill="#241f14">H</text>
    </svg>
    <span class="brand-name">Henriks <em>Honning</em></span>
  </a>
  <div class="menu">
    <a href="/#artikler">Artikler</a>
    <a href="/#aaret">Året i bigården</a>
    <a href="/om/">Om</a>
    <a href="/om/#kontakt">Kontakt</a>
  </div>
</nav>
```

- [ ] **Step 2: Opret footer-partial**

Create `_includes/partials/footer.njk` (kontaktinfo fra metadata):

```njk
<footer id="om-footer">
  <div class="footer-inner">
    <div>
      <svg class="seal" viewBox="0 0 88 88" aria-hidden="true">
        <path d="M44 3 79.5 23.5v41L44 85 8.5 64.5v-41Z" fill="#d9921e"/>
        <path d="M44 10 73.4 27v34L44 78 14.6 61V27Z" fill="none" stroke="#241f14" stroke-width="1.2" opacity=".5"/>
        <text x="44" y="56" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="34" font-style="italic" font-weight="600" fill="#241f14">H</text>
      </svg>
      <h5>{{ metadata.title }}</h5>
      <p>Hobbybiavl på en skovejendom ved Hinge — og en hjemmeside om det, bierne kan lære os om naturen.</p>
    </div>
    <div id="kontakt">
      <span class="label">Kontakt</span>
      <p>Vinderslevholmvej 57<br>8620 Kjellerup<br>
        <a href="mailto:{{ metadata.author.email }}">{{ metadata.author.email }}</a></p>
    </div>
    <div>
      <span class="label">Læs videre</span>
      <p>Artiklerne bygger på dansk faglitteratur om biavl — bl.a. Danmarks Biavlerforenings materialer. Fuld kildeliste under hver artikel.</p>
      <p><a href="/feed.xml">RSS-feed</a></p>
    </div>
  </div>
  <div class="footer-base">
    <span>© {{ metadata.title }}</span>
    <span>Bygget som statisk side · uden cookies og tracking</span>
  </div>
</footer>
```

- [ ] **Step 3: Opret base-layout**

Create `_includes/layouts/base.njk`:

```njk
<!doctype html>
<html lang="{{ metadata.language }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if title %}{{ title }} · {{ metadata.title }}{% else %}{{ metadata.title }} — {{ metadata.tagline }}{% endif %}</title>
  <meta name="description" content="{{ description or metadata.description }}">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="{{ metadata.title }}">
</head>
<body>
  {% include "partials/nav.njk" %}
  <main>
    {{ content | safe }}
  </main>
  {% include "partials/footer.njk" %}
  <script src="/assets/js/reveal.js" defer></script>
</body>
</html>
```

- [ ] **Step 4: Peg placeholder-forsiden på layoutet og byg**

Erstat hele `content/index.njk` med:

```njk
---
layout: layouts/base.njk
---
<h1>Forside kommer i Task 7</h1>
```

Run: `npx @11ty/eleventy`
Expected: Bygger uden fejl.

- [ ] **Step 5: Verificér nav og footer er i output**

Run: `grep -c "brand-name" _site/index.html && grep -c "henrikkjaernielsen@hotmail.com" _site/index.html`
Expected: `1` og `1`.

- [ ] **Step 6: Commit**

```bash
git add _includes/ content/index.njk
git commit -m "feat: base-layout med nav og footer"
```

---

## Task 6: Stylesheet, fonte og reveal-script

**Files:**
- Create: `assets/css/site.css`
- Create: `assets/js/reveal.js`
- Create: `assets/fonts/` (woff2-filer)
- Modify: `eleventy.config.js`

- [ ] **Step 1: Tilføj passthrough-kopiering af assets**

Modify `eleventy.config.js` — tilføj før `return {`:

```js
  eleventyConfig.addPassthroughCopy("assets");
```

- [ ] **Step 2: Hent self-hostede fonte**

Download Fraunces og Inter som woff2 (fx via google-webfonts-helper, `https://gwfh.mranftl.com/fonts`) og læg dem i `assets/fonts/`. Nødvendige filer:
- `fraunces-latin-300-normal.woff2`, `-400-normal`, `-600-normal`, `-900-normal`, samt kursiv `-400-italic`, `-300-italic`, `-600-italic`, `-900-italic`
- `inter-latin-400-normal.woff2`, `-500-normal`, `-600-normal`

Kontrollér at hver fil findes: `ls assets/fonts/*.woff2`
Expected: Alle ovenstående filer listes.

- [ ] **Step 3: Opret stylesheet**

Create `assets/css/site.css`. Overfør ALLE CSS-regler fra `<style>`-blokken i mockup v4 (`.superpowers/brainstorm/647-1784579847/content/design-mockup-v4.html`), med disse ændringer:
- Fjern `@import`/Google Fonts `<link>` — erstat med `@font-face`-blokke, én pr. woff2-fil fra Step 2, fx:

```css
@font-face{
  font-family:'Fraunces';font-style:normal;font-weight:300;font-display:swap;
  src:url('/assets/fonts/fraunces-latin-300-normal.woff2') format('woff2');
}
@font-face{
  font-family:'Fraunces';font-style:italic;font-weight:400;font-display:swap;
  src:url('/assets/fonts/fraunces-latin-400-italic.woff2') format('woff2');
}
/* ... gentag for hver vægt/stil af Fraunces og Inter ... */
```

- Behold alle `:root`-variabler, layout-, hero-, statbånd-, artikel-, årshjul-, citat-, footer-, reveal- og media-query-regler uændret fra mockuppen.
- Behold `@media (prefers-reduced-motion:reduce)`-blokken.

- [ ] **Step 4: Opret reveal-script**

Create `assets/js/reveal.js` (fra mockuppens inline-script):

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
```

- [ ] **Step 5: Byg og verificér assets kopieres**

Run: `npx @11ty/eleventy && ls _site/assets/css/site.css _site/assets/js/reveal.js`
Expected: Begge filer findes i `_site/`.

- [ ] **Step 6: Verificér CSS refererer self-hostede fonte (ingen Google-kald)**

Run: `grep -c "fonts.googleapis" _site/assets/css/site.css`
Expected: `0`.

- [ ] **Step 7: Commit**

```bash
git add assets/ eleventy.config.js
git commit -m "feat: stylesheet, self-hostede fonte og reveal-script"
```

---

## Task 7: Forside med hero, statbånd, artikelindeks, årshjul, citat

**Files:**
- Create: `_includes/partials/statband.njk`
- Create: `_includes/partials/aarshjul.njk`
- Create: `_includes/partials/illustrationer/vitruviansk-bi.njk`
- Create: `_includes/partials/illustrationer/kloever-studie.njk`
- Create: `_includes/partials/illustrationer/halmkube.njk`
- Create: `_includes/partials/illustrationer/celle-geometri.njk`
- Modify: `content/index.njk`

- [ ] **Step 1: Opret de fire SVG-illustrations-partials**

Overfør hver af de fire inline-SVG'er fra mockup v4 til hver sin fil, uændret markup:
- `vitruviansk-bi.njk` ← `<svg class="vitruvian ...">`-blokken (hero)
- `kloever-studie.njk` ← `<figure class="margin-plate ...">`-blokken (botanisk studieblad)
- `halmkube.njk` ← `<svg class="skep-bg ...">`-blokken (årshjul-baggrund)
- `celle-geometri.njk` ← `<svg class="comb-study ...">`-blokken (citat-baggrund)

Bemærk: `<defs>` med `crosshatch`-patterns og `rough`-filtre ligger inde i vitruviansk-bi-SVG'en i mockuppen; behold dem der. Kløver-SVG'en har egne `crosshatch3`/`rough2`. Halmkuben genbruger `crosshatch`/`crosshatch` fra hero-SVG'en — kopier `crosshatch`-pattern-definitionen ind i halmkube.njk's egen `<defs>`, så partialen er selvstændig.

- [ ] **Step 2: Opret statbånd-partial**

Create `_includes/partials/statband.njk` (nøgletal — verificeres mod kilder i Task 12+, behold værdier fra mockup indtil da):

```njk
<section class="stats">
  <div class="stats-inner">
    <div class="stat reveal">
      <div class="num">2.000<sup> æg/døgn</sup></div>
      <p class="desc">lægger dronningen i højsæsonen — mere end sin egen kropsvægt.</p>
      <div class="src">Danmarks Biavlerforening</div>
    </div>
    <div class="stat reveal">
      <div class="num">~1.000<sup> blomster</sup></div>
      <p class="desc">besøger én arbejderbi på en enkelt dag i træktiden.</p>
      <div class="src">Lærebog i biavl</div>
    </div>
    <div class="stat reveal">
      <div class="num">292<sup> arter</sup></div>
      <p class="desc">vilde bier findes i Danmark — og de deler bordet med honningbien.</p>
      <div class="src">Naturhistorisk Museum</div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Opret årshjul-partial**

Create `_includes/partials/aarshjul.njk` — overfør `<section class="season" id="aaret">`-blokken fra mockup v4, og erstat den inline halmkube-SVG med `{% include "partials/illustrationer/halmkube.njk" %}`.

- [ ] **Step 4: Opret forsiden**

Replace `content/index.njk`:

```njk
---
layout: layouts/base.njk
---
<header>
  <div class="hero-inner">
    <div>
      <div class="hero-kicker reveal in">
        <span class="rule"></span>
        <span class="label">Hobbybiavl · Hinge · siden {{ metadata.since }}</span>
      </div>
      <h1 class="reveal in">
        <span class="thin">Bierne &amp;</span><br>
        den danske<br>
        <em>natur<span class="underline"></span></em>
      </h1>
      <p class="hero-sub reveal in">
        Læseværdige artikler om honningbiens forunderlige liv, biodiversiteten i det
        danske landskab og hverdagen i en lille bigård på en skovejendom — skrevet
        med afsæt i dansk faglitteratur om biavl.
      </p>
      <div class="hero-cta reveal in">
        <a class="btn-honey" href="#artikler">Læs artiklerne <span aria-hidden="true">↓</span></a>
        <a class="btn-ghost" href="/om/">Historien bag bigården</a>
      </div>
    </div>
    {% include "partials/illustrationer/vitruviansk-bi.njk" %}
  </div>
  <div class="scroll-hint">Rul</div>
</header>

{% include "partials/statband.njk" %}

<section class="articles" id="artikler">
  <div class="section-head reveal">
    <h2>Artikler <em>fra bigården</em></h2>
    <span class="label">{{ collections.artiklerSorteret | length }} artikler · opdateres løbende</span>
  </div>
  <div class="articles-grid">
    <div>
      {%- for artikel in collections.artiklerSorteret %}
      <a class="article-row reveal" href="{{ artikel.url }}">
        <span class="idx"><b>{{ "%02d" | format(loop.index) }}</b>{{ artikel.data.category }}</span>
        <span>
          <h3>{{ artikel.data.title }}</h3>
          <span class="excerpt">{{ artikel.data.description }}</span>
          <span class="meta">{{ artikel.templateContent | laesetid }} min. læsning</span>
        </span>
        <span class="arrow">→</span>
      </a>
      {%- endfor %}
    </div>
    {% include "partials/illustrationer/kloever-studie.njk" %}
  </div>
</section>

{% include "partials/aarshjul.njk" %}

<section class="quote">
  {% include "partials/illustrationer/celle-geometri.njk" %}
  <span class="mark reveal">”</span>
  <blockquote class="reveal">Uden bestøvere ville hver <b>tredje mundfuld</b> mad se helt anderledes ud.</blockquote>
  <cite class="label reveal">— derfor skriver jeg om bierne</cite>
</section>
```

Bemærk: `format`-filteret til nul-polstring (`"%02d" | format(...)`) er indbygget i Nunjucks. Hvis build fejler på det, erstat med et eget filter i config: `eleventyConfig.addFilter("pad2", n => String(n).padStart(2, "0"))` og brug `{{ loop.index | pad2 }}`.

- [ ] **Step 5: Byg og verificér forsidens sektioner**

Run: `npx @11ty/eleventy && grep -c "vitruvian" _site/index.html && grep -c "stats-inner" _site/index.html && grep -c "id=\"aaret\"" _site/index.html`
Expected: `1`, `1`, `1`.

- [ ] **Step 6: Visuel verifikation**

Run: `npx @11ty/eleventy --serve` og åbn `http://localhost:8080`.
Bekræft manuelt: hero med vitruviansk bi tegner sig, statbånd er mørkegrønt, årshjul og citat vises. (Artikellisten er tom indtil Task 12+ — det er forventet.) Stop serveren med Ctrl+C.

- [ ] **Step 7: Commit**

```bash
git add _includes/partials/ content/index.njk
git commit -m "feat: forside med hero, statbånd, årshjul og illustrationer"
```

---

## Task 8: Om/kontakt-side

**Files:**
- Create: `_includes/layouts/side.njk`
- Create: `content/om.md`

- [ ] **Step 1: Opret side-layout til statiske sider**

Create `_includes/layouts/side.njk`:

```njk
---
layout: layouts/base.njk
---
<article class="static-page">
  <div class="static-inner">
    <span class="label">{{ kicker or "Om" }}</span>
    <h1 class="page-title">{{ title }}</h1>
    {{ content | safe }}
  </div>
</article>
```

- [ ] **Step 2: Tilføj styling for statisk side**

Tilføj til `assets/css/site.css`:

```css
.static-page{padding:150px 48px 90px;}
.static-inner{max-width:680px;margin:0 auto;}
.static-inner .page-title{font-size:clamp(38px,5vw,68px);font-weight:900;letter-spacing:-.015em;margin:14px 0 28px;}
.static-inner p{font-size:17px;line-height:1.8;font-weight:300;color:var(--ink-soft);margin-bottom:20px;}
.static-inner h2{font-size:28px;font-weight:600;margin:36px 0 14px;}
.static-inner a{color:var(--honey-deep);}
@media (max-width:900px){.static-page{padding:120px 22px 70px;}}
```

- [ ] **Step 3: Opret Om-siden**

Create `content/om.md`:

```markdown
---
layout: layouts/side.njk
title: Om Henriks Honning
kicker: Historien bag bigården
description: Om Henrik og den lille bigård på en skovejendom ved Hinge.
permalink: /om/
---

For omkring ti år siden startede jeg som aldeles nybegynder inden for biavl. I dag
passer jeg nogle bifamilier på en skovejendom ved Hinge — som en hobby, der er
vokset sig til en fascination af biernes liv og deres rolle i naturen.

Denne side samler mine artikler om honningbier, biavl og biodiversitet. Jeg skriver
med afsæt i dansk faglitteratur, men altid ud fra det, jeg selv oplever ude ved staderne.

## Kontakt

Har du spørgsmål om bierne eller honningen, er du velkommen til at skrive.

Henrik Kjær Nielsen
Vinderslevholmvej 57, 8620 Kjellerup
[henrikkjaernielsen@hotmail.com](mailto:henrikkjaernielsen@hotmail.com)
```

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && grep -c "Historien bag bigården" _site/om/index.html`
Expected: `1`.

- [ ] **Step 5: Commit**

```bash
git add _includes/layouts/side.njk content/om.md assets/css/site.css
git commit -m "feat: Om/kontakt-side"
```

---

## Task 9: RSS-feed

**Files:**
- Create: `content/feed.njk`
- Modify: `eleventy.config.js`

- [ ] **Step 1: Registrér RSS-plugin**

Modify `eleventy.config.js` — tilføj øverst i filen (før `export default`):

```js
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
```

Og inde i funktionen, før `return {`:

```js
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: { name: "artiklerSorteret", limit: 0 },
    metadata: {
      language: "da",
      title: "Henriks Honning",
      subtitle:
        "Artikler om honningbier, natur og biodiversitet.",
      base: "https://henrikkjaernielsen.github.io/HenriksHonning/",
      author: { name: "Henrik Kjær Nielsen" },
    },
  });
```

- [ ] **Step 2: Byg og verificér feed genereres**

Run: `npx @11ty/eleventy && ls _site/feed.xml`
Expected: `_site/feed.xml` findes. (Feedet er tomt for `<item>` indtil artikler tilføjes — OK.)

- [ ] **Step 3: Verificér feed er velformet XML**

Run: `grep -c "<rss" _site/feed.xml && grep -c "Henriks Honning" _site/feed.xml`
Expected: begge `1` (eller højere).

- [ ] **Step 4: Commit**

```bash
git add eleventy.config.js content/feed.njk 2>/dev/null; git add eleventy.config.js
git commit -m "feat: RSS-feed for artikler"
```

Bemærk: `feedPlugin` genererer feedet uden en separat template-fil; `content/feed.njk` er ikke nødvendig med plugin-tilgangen. Ignorér `content/feed.njk` i filstrukturen hvis pluginnet håndterer outputtet.

---

## Task 10: 404-side

**Files:**
- Create: `content/404.njk`

- [ ] **Step 1: Opret 404-side**

Create `content/404.njk`:

```njk
---
layout: layouts/base.njk
title: Siden blev ikke fundet
permalink: /404.html
eleventyExcludeFromCollections: true
---
<section class="notfound">
  <div class="notfound-inner">
    <span class="label">Fejl 404</span>
    <h1>Her var der ingen honning</h1>
    <p>Siden, du leder efter, findes ikke. Måske er den fløjet videre.</p>
    <a class="btn-honey" href="/">Tilbage til forsiden</a>
  </div>
</section>
```

- [ ] **Step 2: Tilføj styling**

Tilføj til `assets/css/site.css`:

```css
.notfound{min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:150px 22px 90px;}
.notfound-inner h1{font-size:clamp(34px,5vw,60px);font-weight:900;margin:14px 0 18px;}
.notfound-inner p{font-size:17px;font-weight:300;color:var(--ink-soft);margin-bottom:28px;}
```

- [ ] **Step 3: Byg og verificér**

Run: `npx @11ty/eleventy && grep -c "Her var der ingen honning" _site/404.html`
Expected: `1`.

- [ ] **Step 4: Commit**

```bash
git add content/404.njk assets/css/site.css
git commit -m "feat: 404-side i sidens design"
```

---

## Task 11: Artikel-layout med topfoto, faktabokse, kilder og nav

**Files:**
- Create: `_includes/layouts/artikel.njk`
- Modify: `eleventy.config.js` (billed-plugin + prev/next-hjælp)

- [ ] **Step 1: Registrér billed-transform-plugin**

Modify `eleventy.config.js` — tilføj import øverst:

```js
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
```

Og i funktionen, før `return {`:

```js
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto", 800, 1400],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });
```

Dette optimerer automatisk `<img>` i artikelindhold.

- [ ] **Step 2: Opret artikel-layout**

Create `_includes/layouts/artikel.njk`:

```njk
---
layout: layouts/base.njk
---
<article class="article">
  {% if image %}
  <div class="article-hero"><img src="{{ image }}" alt="{{ imageAlt or title }}"></div>
  {% else %}
  <div class="article-hero article-hero--placeholder"></div>
  {% endif %}
  <div class="article-body">
    <div class="article-meta">
      <span class="label">{{ category }}</span>
      <span class="dot">·</span>
      <span class="label">{{ content | laesetid }} min. læsning</span>
    </div>
    <h1 class="article-title">{{ title }}</h1>
    <div class="prose">
      {{ content | safe }}
    </div>

    {% if kilder %}
    <div class="kilder">
      <strong>Kilder</strong>
      <ul>
        {%- for kilde in kilder %}
        <li>{{ kilde | safe }}</li>
        {%- endfor %}
      </ul>
    </div>
    {% endif %}

    <nav class="article-nav">
      {%- set poster = collections.artiklerSorteret %}
      {%- for post in poster %}
        {%- if post.url == page.url %}
          {%- if loop.index0 > 0 %}
          <a class="prev" href="{{ (poster[loop.index0 - 1]).url }}">← {{ (poster[loop.index0 - 1]).data.title }}</a>
          {%- endif %}
          {%- if not loop.last %}
          <a class="next" href="{{ (poster[loop.index0 + 1]).url }}">{{ (poster[loop.index0 + 1]).data.title }} →</a>
          {%- endif %}
        {%- endif %}
      {%- endfor %}
    </nav>
  </div>
</article>
```

- [ ] **Step 3: Tilføj artikel-styling**

Tilføj til `assets/css/site.css`:

```css
.article-hero{width:100%;height:min(46vh,420px);overflow:hidden;}
.article-hero img{width:100%;height:100%;object-fit:cover;display:block;}
.article-hero--placeholder{background:linear-gradient(135deg,var(--honey),var(--moss));}
.article-body{max-width:680px;margin:0 auto;padding:56px 48px 90px;}
.article-meta{display:flex;gap:12px;align-items:center;margin-bottom:16px;}
.article-title{font-size:clamp(34px,5vw,64px);font-weight:900;line-height:1.08;letter-spacing:-.015em;margin-bottom:34px;}
.prose p{font-size:17px;line-height:1.85;font-weight:300;color:var(--ink-soft);margin-bottom:22px;}
.prose h2{font-size:28px;font-weight:600;margin:40px 0 14px;}
.prose blockquote,.prose .fakta{background:#fff;border-left:3px solid var(--honey);border-radius:0 6px 6px 0;padding:16px 20px;margin:26px 0;font-size:15px;line-height:1.7;color:var(--ink-soft);}
.prose .fakta strong{color:var(--honey-deep);display:block;margin-bottom:4px;}
.kilder{border-top:1px solid var(--line);margin-top:44px;padding-top:20px;font-size:13.5px;color:var(--sepia);}
.kilder ul{margin:10px 0 0;padding-left:18px;}
.kilder li{margin-bottom:6px;line-height:1.6;}
.article-nav{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:50px;border-top:1px solid var(--line);padding-top:24px;font-family:'Inter',sans-serif;font-size:14px;}
.article-nav a{color:var(--honey-deep);text-decoration:none;max-width:45%;}
.article-nav .next{margin-left:auto;text-align:right;}
@media (max-width:900px){.article-body{padding:40px 22px 70px;}}
```

- [ ] **Step 4: Byg (ingen artikler endnu — verificér config ikke fejler)**

Run: `npx @11ty/eleventy`
Expected: Bygger uden fejl.

- [ ] **Step 5: Commit**

```bash
git add _includes/layouts/artikel.njk eleventy.config.js assets/css/site.css
git commit -m "feat: artikel-layout med topfoto, faktabokse, kilder og prev/next"
```

---

## Task 12-18: De syv artikler

> **Fælles fremgangsmåde for hver artikel.** Hver artikel er én Markdown-fil i `content/artikler/`. Indholdet skrives på dansk, fagligt funderet, og HVER faktapåstand og hvert nøgletal verificeres mod en dansk kilde, FØR det skrives (Danmarks Biavlerforening, "Lærebog i biavl", Naturhistorisk Museum, Aarstiderne/Miljøstyrelsen om vilde bier m.fl.). `description` er uddraget vist på forsiden. Faktabokse skrives som `<div class="fakta"><strong>Vidste du?</strong> …</div>` i Markdown. `kilder` er en YAML-liste i frontmatter.

**Frontmatter-skabelon (samme for alle syv):**

```markdown
---
title: <titel>
category: <Bierne | Natur | Haven | Honningen | Bigården>
date: 2026-07-<dag, stigende så rækkefølgen bliver 01→07>
description: <1-2 sætningers uddrag til forsiden>
image: <sti til foto i /assets/img/, eller udelad for placeholder-flade>
imageAlt: <alt-tekst>
kilder:
  - "<kilde 1>"
  - "<kilde 2>"
---

<brødtekst i Markdown, 600-1000 ord, med mindst én fakta-boks>
```

---

### Task 12: Artikel 01 — Honningbiens liv

**Files:**
- Create: `content/artikler/01-honningbiens-liv.md`
- Create/Add: `assets/img/honningbiens-liv.jpg` (Henriks foto eller frit stockfoto)

- [ ] **Step 1: Research og verificér nøgletal**

Slå følgende op og notér kilde for hvert: dronningens æglægning i højsæsonen, arbejderbiens levetid (sommer vs. vinter), antal bier i en familie om sommeren, dronernes rolle. Brug Danmarks Biavlerforening og "Lærebog i biavl". Ret statbåndets tal i `_includes/partials/statband.njk`, hvis research modsiger dem.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/01-honningbiens-liv.md` med frontmatter (category: `Bierne`, date: `2026-07-01`) og 600-1000 ords brødtekst om bifamilien som superorganisme: dronning, arbejdere, droner, arbejdsdeling, årsrytme. Mindst én `<div class="fakta">`. Udfyld `kilder`-listen med de verificerede kilder fra Step 1.

- [ ] **Step 3: Læg foto ind**

Læg et relevant foto i `assets/img/honningbiens-liv.jpg` og sæt `image: /assets/img/honningbiens-liv.jpg` i frontmatter. Hvis intet foto er tilgængeligt: udelad `image`-feltet (placeholder-flade bruges).

- [ ] **Step 4: Byg og verificér artiklen og forsidelinket**

Run: `npx @11ty/eleventy && ls _site/artikler/01-honningbiens-liv/index.html && grep -c "Honningbiens liv" _site/index.html`
Expected: filen findes; forsiden nævner titlen (`1` eller højere).

- [ ] **Step 5: Verificér læsetid og kilder vises**

Run: `grep -c "min. læsning" _site/artikler/01-honningbiens-liv/index.html && grep -c "Kilder" _site/artikler/01-honningbiens-liv/index.html`
Expected: begge `1` eller højere.

- [ ] **Step 6: Commit**

```bash
git add content/artikler/01-honningbiens-liv.md assets/img/ _includes/partials/statband.njk
git commit -m "content: artikel 01 — Honningbiens liv"
```

---

### Task 13: Artikel 02 — Bierne og biodiversiteten

**Files:**
- Create: `content/artikler/02-bierne-og-biodiversiteten.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

Verificér antal vilde bi-arter i Danmark (kryds­tjek Naturhistorisk Museum / Miljøstyrelsen — det er tallet i statbåndet), forskellen på honningbier og vilde bier, bestøvningens betydning for afgrøder og vilde planter, og debatten om konkurrence mellem honningbier og vilde bier. Notér kilder.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/02-bierne-og-biodiversiteten.md` (category: `Natur`, date: `2026-07-02`), 600-1000 ord, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/biodiversitet.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && ls _site/artikler/02-bierne-og-biodiversiteten/index.html`
Expected: filen findes.

- [ ] **Step 5: Commit**

```bash
git add content/artikler/02-bierne-og-biodiversiteten.md assets/img/
git commit -m "content: artikel 02 — Bierne og biodiversiteten"
```

---

### Task 14: Artikel 03 — En bivenlig have, sæson for sæson

**Files:**
- Create: `content/artikler/03-en-bivenlig-have.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

List bivenlige planter i dansk klima fordelt på sæson (tidligt forår: krokus, vintergæk, pil; forår: frugttræer, mælkebøtte; sommer: hvidkløver, lind, hjulkrone; sensommer/efterår: asters, eng­plantninger). Kryds­tjek mod Danmarks Biavlerforening / "Havens bier". Genbrug pointer fra det gamle blogindlæg "Prydhaven". Notér kilder.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/03-en-bivenlig-have.md` (category: `Haven`, date: `2026-07-03`), 600-1000 ord opdelt efter sæson, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/bivenlig-have.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && ls _site/artikler/03-en-bivenlig-have/index.html`
Expected: filen findes.

- [ ] **Step 5: Commit**

```bash
git add content/artikler/03-en-bivenlig-have.md assets/img/
git commit -m "content: artikel 03 — En bivenlig have"
```

---

### Task 15: Artikel 04 — Mange slags honning

**Files:**
- Create: `content/artikler/04-mange-slags-honning.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

Verificér danske honningtyper (raps, sommerblomst, lyng, skovhonning), hvorfor honning krystalliserer (glukose/fruktose-forhold), forskellen flydende/fast, og hvordan sort/enkeltblomstret honning fremstilles. Genbrug det gamle indlæg "Mange slags honning". Notér kilder.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/04-mange-slags-honning.md` (category: `Honningen`, date: `2026-07-04`), 600-1000 ord, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/mange-slags-honning.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && ls _site/artikler/04-mange-slags-honning/index.html`
Expected: filen findes.

- [ ] **Step 5: Commit**

```bash
git add content/artikler/04-mange-slags-honning.md assets/img/
git commit -m "content: artikel 04 — Mange slags honning"
```

---

### Task 16: Artikel 05 — Verdens mest bæredygtige fødevare?

**Files:**
- Create: `content/artikler/05-baeredygtige-foedevare.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

Verificér påstande om honnings bæredygtighed: intet markbehov, ingen vanding, lavt CO₂-aftryk, bestøvning som sidegevinst. Vær nuanceret (transport, sukkerfodring, konkurrence med vilde bier). Genbrug det gamle indlæg. Notér kilder — undgå ubelagte superlativer i teksten, lad titlen være det åbne spørgsmål.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/05-baeredygtige-foedevare.md` (category: `Honningen`, date: `2026-07-05`), 600-1000 ord, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/baeredygtig.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && ls _site/artikler/05-baeredygtige-foedevare/index.html`
Expected: filen findes.

- [ ] **Step 5: Commit**

```bash
git add content/artikler/05-baeredygtige-foedevare.md assets/img/
git commit -m "content: artikel 05 — Verdens mest bæredygtige fødevare?"
```

---

### Task 17: Artikel 06 — Året i bigården

**Files:**
- Create: `content/artikler/06-aaret-i-bigaarden.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

Verificér biavlerens årshjul: forårseftersyn (marts-april), sværmforebyggelse og forårstræk (maj-juni), honninghøst og varroabehandling (juli-august), indfodring og vinterklynge (sept-feb). Sørg for at teksten stemmer med årshjul-partialen på forsiden. Genbrug "Højsæson". Notér kilder.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/06-aaret-i-bigaarden.md` (category: `Bigården`, date: `2026-07-06`), 600-1000 ord, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/aaret-i-bigaarden.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér**

Run: `npx @11ty/eleventy && ls _site/artikler/06-aaret-i-bigaarden/index.html`
Expected: filen findes.

- [ ] **Step 5: Commit**

```bash
git add content/artikler/06-aaret-i-bigaarden.md assets/img/
git commit -m "content: artikel 06 — Året i bigården"
```

---

### Task 18: Artikel 07 — Fra blomst til glas

**Files:**
- Create: `content/artikler/07-fra-blomst-til-glas.md`
- Add: foto i `assets/img/`

- [ ] **Step 1: Research og verificér**

Verificér honningens vej: nektarindsamling, honningmave/enzymer, aflevering i tavlen, inddampning/tørring til <20 % vand, forsegling med voks, slyngning og tapning. Notér kilder.

- [ ] **Step 2: Skriv artiklen**

Create `content/artikler/07-fra-blomst-til-glas.md` (category: `Honningen`, date: `2026-07-07`), 600-1000 ord, mindst én fakta-boks, verificeret `kilder`-liste.

- [ ] **Step 3: Foto**

Læg foto i `assets/img/fra-blomst-til-glas.jpg` og sæt `image`, eller udelad.

- [ ] **Step 4: Byg og verificér hele artikelsættet**

Run: `npx @11ty/eleventy && ls _site/artikler/ && grep -c "article-row" _site/index.html`
Expected: 7 artikelmapper listes; forsiden har 7 `article-row` (grep-tal ≥ 7).

- [ ] **Step 5: Verificér prev/next-navigation**

Run: `grep -c "article-nav" _site/artikler/04-mange-slags-honning/index.html`
Expected: `1` (midterartikel har både forrige og næste).

- [ ] **Step 6: Commit**

```bash
git add content/artikler/07-fra-blomst-til-glas.md assets/img/
git commit -m "content: artikel 07 — Fra blomst til glas"
```

---

## Task 19: GitHub Actions-deploy til GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Opret workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Build og deploy til GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx @11ty/eleventy --pathprefix "/HenriksHonning/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Bemærk: `--pathprefix "/HenriksHonning/"` matcher repo-navnet på GitHub Pages' projektside-URL. Når eget domæne tilkobles senere, fjernes pathprefix, og en `CNAME`-fil tilføjes i `assets/`.

- [ ] **Step 2: Verificér lokal build stadig virker med pathprefix**

Run: `npx @11ty/eleventy --pathprefix "/HenriksHonning/"`
Expected: Bygger uden fejl. (Interne links med `|url`-filter håndteres af Eleventy; bemærk at hardcodede links i partials starter med `/` — konvertér nav/footer/forside-links til `{{ "/om/" | url }}`-form hvis pathprefix giver 404 på Pages. Se Step 3.)

- [ ] **Step 3: Gør interne links pathprefix-sikre**

Gennemgå `_includes/partials/nav.njk`, `_includes/partials/footer.njk`, `content/index.njk` og artikel-layoutets links. Ombryd hver intern URL og hvert asset-link med `url`-filteret, fx:
- `href="/"` → `href="{{ '/' | url }}"`
- `href="/om/"` → `href="{{ '/om/' | url }}"`
- `href="/assets/css/site.css"` → `href="{{ '/assets/css/site.css' | url }}"`
- `src="/assets/js/reveal.js"` → `src="{{ '/assets/js/reveal.js' | url }}"`
- CSS-`@font-face` `url()`-stier kan ikke bruge filteret; behold dem relative fra site-roden — de virker, fordi `site.css` selv serveres under pathprefix og stierne er absolutte fra domænet. For at være pathprefix-sikker: brug relative stier i CSS (`url('../fonts/...')`).

Run: `npx @11ty/eleventy --pathprefix "/HenriksHonning/" && grep -c "/HenriksHonning/om/" _site/index.html`
Expected: `1` eller højere (linket er præfikset korrekt).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml _includes/ content/index.njk assets/css/site.css
git commit -m "ci: GitHub Actions-deploy til GitHub Pages med pathprefix"
```

- [ ] **Step 5: Manuelt (kræver GitHub-konto — udføres af Henrik)**

Opret repo på GitHub, push `main`, og aktivér Pages under Settings → Pages → Source: "GitHub Actions". Efter første kørsel er sitet live på `https://<bruger>.github.io/HenriksHonning/`.

---

## Task 20: Endelig verifikation

**Files:** ingen (kun verifikation)

- [ ] **Step 1: Ren build fra bunden**

Run: `rm -rf _site && npx @11ty/eleventy`
Expected: Bygger uden fejl eller advarsler; forside, 7 artikler, om-side, 404 og feed.xml genereres.

- [ ] **Step 2: Tjek at ingen eksterne kald sker**

Run: `grep -rc "fonts.googleapis\|loremflickr\|googletagmanager\|google-analytics" _site/ | grep -v ":0" || echo "INGEN EKSTERNE KALD"`
Expected: `INGEN EKSTERNE KALD`.

- [ ] **Step 3: Visuel gennemgang i browser**

Run: `npx @11ty/eleventy --serve` og gennemgå ved 375 px, 768 px og 1440 px:
- Forside: hero-illustration tegner sig, statbånd, artikelindeks (7 rækker med korrekt nummer/kategori/læsetid), kløver-studieblad i margen, årshjul med halmkube, citat med celle-geometri
- En artikelside: topfoto/placeholder, faktaboks, kilder, prev/next
- Om-side og 404-side
- Reveal-animationer og hover-effekter
Stop serveren med Ctrl+C.

- [ ] **Step 4: Verificér prefers-reduced-motion**

I browserens DevTools, aktivér "Emulate prefers-reduced-motion: reduce" og genindlæs. Bekræft at animationer er slået fra og alt indhold er synligt.

- [ ] **Step 5: Slutcommit hvis rettelser blev nødvendige**

```bash
git add -A
git commit -m "fix: rettelser efter endelig verifikation" || echo "ingen ændringer"
```

---

## Self-Review (udført af planforfatter)

**Spec-dækning:**
- Forside/hero/statbånd/artikelindeks/årshjul/citat/footer → Task 5, 7 ✓
- Artikelsider med topfoto, faktabokse, kilder, prev/next → Task 11 ✓
- Om/kontakt-side → Task 8 ✓
- 7 artikler fra artikelplanen → Task 12-18 (kategorier og grundlag matcher spec-tabellen) ✓
- Palette, typografi, 4 da Vinci-illustrationer → Task 6 (CSS), Task 7 (SVG-partials) ✓
- Bevægelse + prefers-reduced-motion → Task 6, verificeret Task 20 ✓
- Eleventy-arkitektur/mappestruktur → Task 2-7 ✓ (afviger bevidst: RSS via plugin uden feed.njk, se Task 9)
- Markdown-arbejdsgang for nye artikler → frontmatter-skabelon i Task 12-18-intro ✓
- Self-hostede fonte, ingen cookies/tracking → Task 6, verificeret Task 20 ✓
- RSS → Task 9 ✓
- SEO/a11y (lang, meta, alt, kontrast, fokus) → Task 5 (base), Task 11 (alt), CSS ✓
- Nøgletal verificeres mod kilder → indbygget i Task 12-13 (statbånd) ✓
- Deploy GitHub Pages/Actions → Task 19 ✓
- Fejlhåndtering (manglende foto, 404, CI-fejl) → Task 11 (placeholder), Task 10 (404), Pages-adfærd ✓
- Test/verifikation (lokal serve, links, responsiv) → Task 20 ✓
- Uden for scope (webshop, kommentarer, søgning, CMS) → ikke medtaget ✓

**Placeholder-scan:** Ingen "TBD"/"TODO". Artikel-brødtekst er bevidst ikke fuldt skrevet i planen, fordi den kræver kildeverifikation under udførelse; til gengæld er struktur, frontmatter, kategori, dato, ordantal, fakta-boks-krav og kildekrav specificeret per artikel.

**Type/navne-konsistens:** Collection-navn `artiklerSorteret` bruges konsistent (Task 4, 7, 9, 11). Filter `laesetid` konsistent (Task 4, 7, 11). CSS-klasser matcher mockup v4 (`article-row`, `stats-inner`, `season`, `quote`, `vitruvian`). Layout-stier (`layouts/base.njk`, `layouts/artikel.njk`, `layouts/side.njk`) konsistente mellem config, artikler.json og frontmatter.
