# Galleri »Bigården i billeder« — implementeringsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ny side `/billeder/` med 18 kuraterede fotos i fire årstidssektioner, lightbox og menupunkt — jf. spec `docs/superpowers/specs/2026-07-21-galleri-design.md`.

**Architecture:** Statisk Eleventy-side. Global datafil (`content/_data/galleri.js`) beskriver sektioner og billeder; `content/billeder.njk` renderer dem i et 12-kolonners grid; et engangs-importscript genererer web-optimerede JPEG'er fra `_raw/galleri/` (gitignoreret) til `assets/img/galleri/` (committes). Lightbox = native `<dialog>` + ~50 linjer vanilla JS.

**Tech Stack:** Eleventy 3, Nunjucks, sharp (allerede i node_modules som dependency af eleventy-img), vanilla CSS/JS i sitets eksisterende designsprog.

**Verifikation:** Projektet har ingen testramme. Hver task verificeres med `npm run build` + kontrol af output (grep/fil-tjek) og afsluttes med commit. Slutverifikation sker manuelt i browser via `npm start`.

**VIGTIGT — navnekollision:** `assets/css/site.css` har allerede en `.season`-klasse (forsidens årshjul). Alle galleri-klasser hedder derfor `galleri-*`. Genbrug kun `.label`, `.reveal` og CSS-variablerne.

**Reference:** Godkendt mockup med endeligt layout: `.superpowers/brainstorm/1040-1784641568/content/galleri-a-fuld-v5.html`.

---

### Task 1: Importscript og web-optimerede billeder

**Files:**
- Create: `scripts/importer-galleri.mjs`
- Output: `assets/img/galleri/*.jpg` (18 filer, committes)

- [ ] **Step 1.1: Tjek at originalerne findes**

Run: `ls _raw/galleri | wc -l`
Expected: `38` (37 fotos + 1 video; IMG_5579 er slettet tidligere)

- [ ] **Step 1.2: Opret scriptet**

Opret `scripts/importer-galleri.mjs` med præcis dette indhold:

```js
// Engangs-import: læser originaler fra _raw/galleri (uden for git),
// retter EXIF-rotation og genererer web-optimerede JPEG'er til assets/img/galleri.
// Kør:  node scripts/importer-galleri.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KILDE = "_raw/galleri";
const MAAL = "assets/img/galleri";

// original → web-slug (jf. spec, tabellen "Endelig billedliste")
const BILLEDER = {
  "IMG_7009.JPG": "vintergaekker",
  "IMG_7062.JPG": "paaskeliljer-anemoner",
  "IMG_7113.JPG": "mirabelle-april",
  "IMG_7117.JPG": "mirabelle-blomster",
  "IMG_3508.JPG": "stade-aerenpris",
  "IMG_0264.JPG": "haven-maj",
  "IMG_6153.JPG": "skovstade-hoej",
  "2023-07-28-11-37-35-707.PNG": "ejendommen-fra-luften",
  "IMG_6583.JPG": "asters",
  "IMG_6152.JPG": "skovstade-juli",
  "IMG_5137.jpg": "magasiner-stablet",
  "IMG_5138.jpg": "tavler-skaeres",
  "IMG_5142.JPG": "honning-tappes",
  "IMG_5129.jpg": "tavleglas-bakke",
  "IMG_5133.jpg": "tavleglas-bord",
  "IMG_6755.JPG": "boegeskov-oktober",
  "IMG_6768.JPG": "stade-efteraar",
  "IMG_5420.JPG": "huset-efteraar",
};

await mkdir(MAAL, { recursive: true });
for (const [fil, slug] of Object.entries(BILLEDER)) {
  const ud = path.join(MAAL, `${slug}.jpg`);
  const info = await sharp(path.join(KILDE, fil))
    .rotate() // anvender EXIF-orientering og fjerner tagget
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(ud);
  console.log(`${fil} -> ${ud} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
console.log(`Færdig: ${Object.keys(BILLEDER).length} billeder.`);
```

- [ ] **Step 1.3: Kør scriptet**

Run: `node scripts/importer-galleri.mjs`
Expected: 18 linjer `… -> assets/img/galleri/….jpg (…)` + `Færdig: 18 billeder.` Ingen fejl.

- [ ] **Step 1.4: Verificér output**

Run: `ls assets/img/galleri | wc -l && du -sh assets/img/galleri`
Expected: `18` filer, samlet ca. 3–7 MB. Åbn evt. `assets/img/galleri/honning-tappes.jpg` og bekræft at billedet vender rigtigt (portræt, honningstrøm lodret — originalen har EXIF-rotation).

- [ ] **Step 1.5: Commit**

```bash
git add scripts/importer-galleri.mjs assets/img/galleri
git commit -m "galleri: importscript + 18 web-optimerede fotos"
```

---

### Task 2: Datafil med sektioner og billedtekster

**Files:**
- Create: `content/_data/galleri.js`

- [ ] **Step 2.1: Opret datafilen**

Opret `content/_data/galleri.js` med præcis dette indhold (tekster er godkendt i spec — ret dem ikke):

```js
// Galleriet på /billeder/: fire årstidssektioner.
// format: "bred" (16/10), "hoej" (3/4), "hero" (21/10) — span: kolonner af 12.
export default [
  {
    nummer: "01",
    periode: "Februar–april",
    titel: "Foråret melder sig",
    intro:
      "Skovbunden vågner, længe før bierne for alvor flyver — vintergækker, påskeliljer og anemoner er årets første bud på pollen.",
    billeder: [
      {
        fil: "vintergaekker", format: "bred", span: 7,
        tekst: "Vintergækker i tusindtal ved den gamle lade, februar.",
        alt: "Tæppe af blomstrende vintergækker i græsset foran en rødmalet lade i det tidlige forår",
      },
      {
        fil: "paaskeliljer-anemoner", format: "bred", span: 5,
        tekst: "Påskeliljer, anemoner og lærkespore i skovbunden, april.",
        alt: "Skovbund med gule påskeliljer, hvide anemoner og lyserød lærkespore i forårssol",
      },
      {
        fil: "mirabelle-april", format: "hoej", span: 6,
        tekst: "Mirabellen blomstrer mod aprilhimlen.",
        alt: "Lille træ i fuld hvid blomstring foran nøgne skovtræer og dybblå himmel",
      },
      {
        fil: "mirabelle-blomster", format: "hoej", span: 6,
        tekst: "Tæt på blomsterne — mad til de første trækbier.",
        alt: "Gren med tætte hvide mirabelblomster fotograferet helt tæt på",
      },
    ],
  },
  {
    nummer: "02",
    periode: "Maj–juli",
    titel: "Bigården i skoven",
    intro:
      "Staderne står spredt på ejendommen — i skovbryn, på skrænter og i den gamle have, hvor rhododendron og ærenpris blomstrer.",
    billeder: [
      {
        fil: "stade-aerenpris", format: "hero", span: 12,
        tekst: "Stadet ved garagen med et tæppe af tveskægget ærenpris — de grønne kasser anes hele vejen op gennem græsset.",
        alt: "Grønt bistade i højt græs med et blåt tæppe af tveskægget ærenpris, hus og garage bag træerne",
      },
      {
        fil: "haven-maj", format: "bred", span: 5,
        tekst: "Haven i maj: rhododendron og de første slåede stier.",
        alt: "Frodig have med rød og lilla rhododendron og en nyslået sti gennem højt græs",
      },
      {
        fil: "skovstade-hoej", format: "hoej", span: 3,
        tekst: "Et enligt stade på skrænten mellem høgeurt og bregner.",
        alt: "Enkelt grønt bistade med blå strop på en skovskrænt omgivet af gul høgeurt",
      },
      {
        fil: "ejendommen-fra-luften", format: "bred", span: 4,
        tekst: "Ejendommen fra luften — skov til alle sider.",
        alt: "Luftfoto af hvidt hus omgivet af tæt skov med marker i horisonten",
      },
      {
        fil: "asters", format: "hoej", span: 4,
        tekst: "Asters i bedet — et af havens sene trækplastre.",
        alt: "Lilla asters i et staudebed med rosa blomster i baggrunden",
      },
      {
        fil: "skovstade-juli", format: "bred", span: 8,
        tekst: "Skovstadet i juli — omgivet af høgeurt på den lysåbne skrænt.",
        alt: "Grønt bistade på en lysåben skrænt i bøgeskoven med gule blomster i forgrunden",
      },
    ],
  },
  {
    nummer: "03",
    periode: "August",
    titel: "Høsten",
    intro:
      "Magasinerne bæres ind, tavlerne skæres, og honningen får lov at løbe — fra ramme til glas uden omveje.",
    billeder: [
      {
        fil: "magasiner-stablet", format: "hoej", span: 4,
        tekst: "Magasinerne stables i bryggerset — klar til afdækning.",
        alt: "Grønne honningmagasiner stablet oven på hinanden indendørs med tavlerammer i",
      },
      {
        fil: "tavler-skaeres", format: "bred", span: 8,
        tekst: "Tavlehonningen skæres i blokke direkte fra rammen.",
        alt: "Hånd med kniv skærer blokke af lys tavlehonning på en rist over en bakke",
      },
      {
        fil: "honning-tappes", format: "hoej", span: 4,
        tekst: "Honningen løber fra tappehanen — langsomt og gyldent.",
        alt: "Gylden honningstrøm løber fra tappehanen på en orange honningbeholder",
      },
      {
        fil: "tavleglas-bakke", format: "hoej", span: 4,
        tekst: "Tavlehonning i glas — en hel bradepande fuld.",
        alt: "Bradepande fyldt med glas, hvert med et stykke tavlehonning, fotograferet ovenfra",
      },
      {
        fil: "tavleglas-bord", format: "hoej", span: 4,
        tekst: "Tavlehonning klar til at blive fyldt op med flydende honning — august måneds fineste øjeblik.",
        alt: "Glas med lodrette stykker tavlehonning på spisebordet og en buket blomster i baggrunden",
      },
    ],
  },
  {
    nummer: "04",
    periode: "Oktober–november",
    titel: "Skoven lukker året",
    intro:
      "Bierne er fodret og klar til vinter; skoven omkring staderne står i gult og kobber, inden roen sænker sig.",
    billeder: [
      {
        fil: "boegeskov-oktober", format: "bred", span: 8,
        tekst: "Bøgeskoven i oktober — de gamle, krogede træer i eftermiddagslys.",
        alt: "Gamle krogede bøgetræer med gyldent løv og rødbrunt løvtæppe i lavt eftermiddagslys",
      },
      {
        fil: "stade-efteraar", format: "hoej", span: 4,
        tekst: "Vinterklart stade i efterårsskoven — remmen holder låget mod stormene.",
        alt: "Grønt bistade med rem om låget i efterårsskov med orange og gult løv",
      },
      {
        fil: "huset-efteraar", format: "hero", span: 12,
        tekst: "Huset bag de gule kroner — bigårdens stille årstid begynder.",
        alt: "Huset skimtes bag bøgetræer i kraftige gule og orange efterårsfarver",
      },
    ],
  },
];
```

- [ ] **Step 2.2: Verificér at filen kan importeres og stemmer**

Run: `node -e "import('./content/_data/galleri.js').then(m=>{const g=m.default;console.log(g.length+' sektioner, '+g.flatMap(s=>s.billeder).length+' billeder')})"`

Expected: `4 sektioner, 18 billeder`

- [ ] **Step 2.3: Verificér at hver slug matcher en billedfil**

Run: `node -e "import('./content/_data/galleri.js').then(async m=>{const {existsSync}=await import('node:fs');const mangler=m.default.flatMap(s=>s.billeder).filter(b=>!existsSync('assets/img/galleri/'+b.fil+'.jpg'));console.log(mangler.length?'MANGLER: '+mangler.map(b=>b.fil).join(', '):'Alle 18 filer findes')})"`
Expected: `Alle 18 filer findes`

- [ ] **Step 2.4: Commit**

```bash
git add content/_data/galleri.js
git commit -m "galleri: datafil med sektioner, billedtekster og alt-tekster"
```

---

### Task 3: Skabelon for /billeder/

**Files:**
- Create: `content/billeder.njk`

- [ ] **Step 3.1: Opret skabelonen**

Opret `content/billeder.njk` med præcis dette indhold (lightbox-dialogen og scriptet kommer i Task 5 — bemærk at `<a href>` allerede nu linker til billedfilen som no-JS-fallback):

```njk
---
layout: layouts/base.njk
title: Bigården i billeder
description: Fotografier fra bigården, haven og skoven i Hinge — året rundt.
image: /assets/img/galleri/stade-aerenpris.jpg
permalink: /billeder/
---
<section class="galleri">
  <div class="galleri-head reveal in">
    <div class="galleri-kicker"><span class="rule"></span><span class="label">Bigården i billeder · året rundt</span></div>
    <h1 class="galleri-titel">Året gennem <em>linsen</em></h1>
    <p class="galleri-intro">Fra de første vintergækker til de sidste efterårsfarver — billeder fra bigården, haven og skoven i Hinge.</p>
  </div>

  {%- for sektion in galleri %}
  <div class="galleri-sektion">
    <div class="galleri-sektion-head reveal">
      <span class="num">{{ sektion.nummer }} · {{ sektion.periode }}</span>
      <h2>{{ sektion.titel }}</h2>
    </div>
    <p class="galleri-sektion-intro reveal">{{ sektion.intro }}</p>
    <div class="galleri-grid">
      {%- for b in sektion.billeder %}
      <figure class="galleri-figur galleri-{{ b.format }} reveal" style="--span:{{ b.span }}">
        <a href="/assets/img/galleri/{{ b.fil }}.jpg">
          <img src="/assets/img/galleri/{{ b.fil }}.jpg" alt="{{ b.alt }}"{% if not (loop.first and sektion.nummer == "01") %} loading="lazy"{% endif %}>
        </a>
        <figcaption>{{ b.tekst }}</figcaption>
      </figure>
      {%- endfor %}
    </div>
  </div>
  {%- endfor %}
</section>
```

- [ ] **Step 3.2: Byg og verificér output**

Run: `npm run build && grep -c "<figure" _site/billeder/index.html`
Expected: Build uden fejl; `18`

- [ ] **Step 3.3: Verificér lazy-loading og titel**

Run: `grep -c 'loading="lazy"' _site/billeder/index.html && grep -o "<title>[^<]*</title>" _site/billeder/index.html`
Expected: `17` (alle undtagen første billede) og `<title>Bigården i billeder · Henriks Honning</title>`

- [ ] **Step 3.4: Commit**

```bash
git add content/billeder.njk
git commit -m "galleri: skabelon for /billeder/ med fire årstidssektioner"
```

---

### Task 4: Galleri-CSS

**Files:**
- Modify: `assets/css/site.css` (tilføj ny sektion nederst, efter `.article-nav`-reglerne, linje ~327)

- [ ] **Step 4.1: Tilføj CSS**

Tilføj nederst i `assets/css/site.css` (brug IKKE klassenavnet `.season` — det er optaget af forsidens årshjul):

```css
/* ---------- galleri (/billeder/) ---------- */
.galleri{padding:150px 48px 90px;max-width:1240px;margin:0 auto;}
.galleri-kicker{display:flex;align-items:center;gap:16px;margin-bottom:18px;}
.galleri-kicker .rule{height:1px;width:72px;background:var(--honey);}
.galleri-titel{font-size:clamp(40px,5.6vw,76px);font-weight:300;line-height:1.04;letter-spacing:-.015em;}
.galleri-titel em{font-style:italic;color:var(--sepia);}
.galleri-intro{margin-top:16px;max-width:56ch;font-size:16px;line-height:1.7;font-weight:300;font-style:italic;color:var(--ink-soft);}
.galleri-sektion{margin-top:72px;}
.galleri-sektion-head{display:flex;align-items:baseline;gap:18px;border-bottom:1px solid var(--line);padding-bottom:10px;}
.galleri-sektion-head .num{font-family:'Inter',system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--honey-deep);white-space:nowrap;}
.galleri-sektion-head h2{font-size:clamp(26px,3vw,38px);font-weight:400;font-style:italic;color:var(--forest);}
.galleri-sektion-intro{margin:14px 0 24px;max-width:54ch;font-size:14.5px;line-height:1.65;font-weight:300;font-style:italic;color:var(--ink-soft);}
.galleri-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px;}
.galleri-figur{margin:0;grid-column:span var(--span,12);}
.galleri-figur a{display:block;overflow:hidden;border-radius:6px;background:var(--paper-deep);}
.galleri-figur img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.6,.2,1);}
.galleri-figur a:hover img{transform:scale(1.03);}
.galleri-bred a{aspect-ratio:16/10;}
.galleri-hoej a{aspect-ratio:3/4;}
.galleri-hero a{aspect-ratio:21/10;}
.galleri-figur figcaption{margin-top:8px;font-size:13px;font-style:italic;line-height:1.5;color:var(--ink-soft);}
@media (max-width:900px){
  .galleri{padding:120px 22px 70px;}
  .galleri-grid{gap:14px;}
  .galleri-figur{grid-column:span 12;}
  .galleri-hero a{aspect-ratio:16/10;}
  .galleri-sektion{margin-top:52px;}
}
```

- [ ] **Step 4.2: Byg og se siden**

Run: `npm run build` — Expected: ingen fejl.
Start dev-server: `npm start` og åbn `http://localhost:8080/billeder/`. Tjek: grid som i mockuppen (hero i fuld bredde, blandede spænd), hover-zoom, reveal-animation ved scroll, én kolonne under 900 px (smaller vindue). Stop serveren igen.

- [ ] **Step 4.3: Commit**

```bash
git add assets/css/site.css
git commit -m "galleri: grid- og sektions-CSS i sitets designsprog"
```

---

### Task 5: Lightbox

**Files:**
- Create: `assets/js/galleri.js`
- Modify: `content/billeder.njk` (dialog + script nederst)
- Modify: `assets/css/site.css` (lightbox-styles nederst)

- [ ] **Step 5.1: Tilføj dialog og script-reference i skabelonen**

I `content/billeder.njk`, indsæt umiddelbart efter den afsluttende `</section>`:

```njk
<dialog id="galleri-lightbox" class="galleri-lightbox" aria-label="Billedfremviser">
  <button class="lb-luk" aria-label="Luk">×</button>
  <button class="lb-forrige" aria-label="Forrige billede">←</button>
  <figure>
    <img src="" alt="">
    <figcaption></figcaption>
  </figure>
  <button class="lb-naeste" aria-label="Næste billede">→</button>
</dialog>
<script src="/assets/js/galleri.js" defer></script>
```

- [ ] **Step 5.2: Opret lightbox-scriptet**

Opret `assets/js/galleri.js` med præcis dette indhold:

```js
// Lightbox for /billeder/ — native <dialog>, ingen afhængigheder.
// Uden JS virker galleriet som almindelige links til billedfilerne.
(() => {
  const dialog = document.getElementById("galleri-lightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const links = Array.from(document.querySelectorAll(".galleri-figur a"));
  const billede = dialog.querySelector("img");
  const tekst = dialog.querySelector("figcaption");
  let aktiv = 0;

  const vis = (i) => {
    aktiv = (i + links.length) % links.length;
    const a = links[aktiv];
    billede.src = a.href;
    billede.alt = a.querySelector("img").alt;
    tekst.textContent = a.closest("figure").querySelector("figcaption").textContent;
  };

  links.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      vis(i);
      dialog.showModal();
    });
  });

  dialog.querySelector(".lb-luk").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lb-forrige").addEventListener("click", () => vis(aktiv - 1));
  dialog.querySelector(".lb-naeste").addEventListener("click", () => vis(aktiv + 1));
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") vis(aktiv - 1);
    if (e.key === "ArrowRight") vis(aktiv + 1);
  });
  // klik på baggrunden (selve dialog-elementet, ikke indholdet) lukker
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
})();
```

- [ ] **Step 5.3: Tilføj lightbox-CSS**

Tilføj nederst i `assets/css/site.css` (efter galleri-reglerne fra Task 4):

```css
/* ---------- galleri-lightbox ---------- */
.galleri-lightbox{border:none;padding:0;background:transparent;max-width:min(92vw,1200px);}
.galleri-lightbox::backdrop{background:rgba(24,20,12,.88);backdrop-filter:blur(3px);}
.galleri-lightbox figure{margin:0;}
.galleri-lightbox img{display:block;max-width:min(92vw,1200px);max-height:82vh;width:auto;height:auto;margin:0 auto;border-radius:6px;}
.galleri-lightbox figcaption{margin-top:12px;text-align:center;font-family:Georgia,serif;font-size:14px;font-style:italic;color:#f3ecdc;}
.galleri-lightbox button{
  position:fixed;z-index:2;border:none;cursor:pointer;
  width:46px;height:46px;border-radius:50%;
  background:rgba(246,241,229,.14);color:#f3ecdc;font-size:20px;line-height:1;
  transition:background .25s;
}
.galleri-lightbox button:hover{background:rgba(217,146,30,.5);}
.galleri-lightbox .lb-luk{top:18px;right:18px;}
.galleri-lightbox .lb-forrige{left:14px;top:50%;transform:translateY(-50%);}
.galleri-lightbox .lb-naeste{right:14px;top:50%;transform:translateY(-50%);}
@media (max-width:900px){
  .galleri-lightbox .lb-forrige,.galleri-lightbox .lb-naeste{top:auto;bottom:16px;transform:none;}
  .galleri-lightbox .lb-forrige{left:calc(50% - 60px);}
  .galleri-lightbox .lb-naeste{right:calc(50% - 60px);}
}
```

- [ ] **Step 5.4: Byg og test lightboxen manuelt**

Run: `npm run build && grep -c "galleri-lightbox" _site/billeder/index.html`
Expected: mindst `2` (dialog + class).

Start `npm start`, åbn `http://localhost:8080/billeder/` og tjek: klik åbner billedet stort med billedtekst; pil-taster og knapper bladrer (også hen over enderne); Esc, ×-knap og klik på baggrunden lukker; fokus er fanget i dialogen (Tab cykler mellem knapperne). Stop serveren.

- [ ] **Step 5.5: Commit**

```bash
git add assets/js/galleri.js content/billeder.njk assets/css/site.css
git commit -m "galleri: lightbox med native dialog, tastatur og swipe-venlige knapper"
```

---

### Task 6: Menupunkt i nav og footer

**Files:**
- Modify: `_includes/partials/nav.njk:5-10`
- Modify: `_includes/partials/footer.njk:12-16`

- [ ] **Step 6.1: Nav**

I `_includes/partials/nav.njk` ændres menuen til (nyt link mellem »Året i bigården« og »Om«):

```njk
  <div class="menu">
    <a href="/#artikler">Artikler</a>
    <a href="/#aaret">Året i bigården</a>
    <a href="/billeder/">Billeder</a>
    <a href="/om/">Om</a>
    <a href="/om/#kontakt">Kontakt</a>
  </div>
```

- [ ] **Step 6.2: Footer**

I `_includes/partials/footer.njk` udvides »Læs videre«-kolonnen med et link til galleriet — afsnittet ændres til:

```njk
    <div>
      <span class="label">Læs videre</span>
      <p>Artiklerne bygger på dansk faglitteratur om biavl — bl.a. Danmarks Biavlerforenings materialer. Fuld kildeliste under hver artikel.</p>
      <p><a href="/billeder/">Bigården i billeder</a> · <a href="/feed.xml">RSS-feed</a></p>
    </div>
```

- [ ] **Step 6.3: Byg og verificér**

Run: `npm run build && grep -c 'href="/billeder/"' _site/index.html`
Expected: `2` (nav + footer). Bemærk: bygges der med et path-prefix, omskriver HtmlBasePlugin URL'erne — kør i så fald grep'en mod det prefiksede href i stedet.

- [ ] **Step 6.4: Commit**

```bash
git add _includes/partials/nav.njk _includes/partials/footer.njk
git commit -m "galleri: menupunkt 'Billeder' i nav og footer"
```

---

### Task 7: Slutverifikation

- [ ] **Step 7.1: Fuldt byg**

Run: `npm run build`
Expected: ingen fejl/warnings ud over evt. kendte.

- [ ] **Step 7.2: Manuel gennemgang i browser**

Start `npm start` og gennemgå på `http://localhost:8080`:

1. Forside → klik »Billeder« i nav → lander på galleriet.
2. Galleriet: fire sektioner, 18 billeder, billedtekster korrekte (stikprøve mod spec-tabellen).
3. Lightbox: åbn/bladr/luk med mus og tastatur.
4. Mobilbredde (~390 px): én kolonne, ingen horisontal scroll, nav skjult som på øvrige sider.
5. Om-siden og en artikel: footer-linket »Bigården i billeder« virker.
6. `prefers-reduced-motion` (emulér i devtools): ingen animationer, alt indhold synligt.

- [ ] **Step 7.3: Ryd op og afslut**

Eventuelle rettelser fra 7.2 committes som `galleri: finpudsning efter gennemgang`.
