# Henriks Honning — ny statisk hjemmeside (design)

**Dato:** 2026-07-20
**Status:** Godkendt af Henrik i brainstorm-session
**Erstatter:** https://henrikshonning.blogspot.com (forbliver som arkiv)

## Formål

En moderne, statisk hjemmeside om hobbybiavl med læseværdige danske artikler om
honningbier, natur og biodiversitet. Formidling og kontakt — intet salg, ingen webshop.

Målgruppe: naturinteresserede læsere og folk, der overvejer biavl. Tonen er personlig,
venlig og fagligt funderet — som den gamle blog, men mere gennemarbejdet.

## Beslutninger truffet under brainstorm

| Emne | Beslutning |
|---|---|
| Indhold | Nye artikler skrevet med afsæt i dansk faglitteratur + de bedste gamle blogindlæg omskrevet |
| Formål | Formidling + Om/kontakt-side. Intet salg |
| Vedligehold | Artikler som Markdown-filer; Henrik kan selv tilføje |
| Teknik | Eleventy (11ty) statisk site-generator |
| Hosting | GitHub Pages med GitHub Actions-build ved hvert push |
| Fotos | Henriks egne fotos suppleret med gratis stockfotos |
| Visuel stil | "Naturlig & varm" med redaktionel typografi og da Vinci-illustrationer (mockup v4 godkendt) |
| Forsidelayout | Velkomst-hero + artikelindeks som nummereret liste |
| Lancering | 7 artikler |

## Sider og struktur

1. **Forside**
   - Fast topnavigation: logo (hexagon-monogram "H") + menu (Artikler · Året i bigården · Om · Kontakt)
   - Hero: stor overskrift "Bierne & den danske natur", kicker-linje ("Hobbybiavl · Hinge · siden 2014"),
     manchet og to knapper (Læs artiklerne / Historien bag bigården). Til højre: den vitruvianske bi (se Illustrationer)
   - Mørkegrønt statbånd med tre nøgletal med kildeangivelse
   - Artikelindeks: nummererede rækker (01-07) med kategori, titel, uddrag, læsetid og hover-effekter.
     I margenen: botanisk studieblad (sticky ved scroll)
   - Årshjul: 4 nedslag (forårseftersyn, sværmtid, honninghøst, vinterklyngen) på stiplet tidslinje,
     halmkube-skitse i baggrunden
   - Pull-quote-sektion med honningcelle-geometristudie i baggrunden
   - Footer (mørkegrøn): vokssegl-monogram, kort om-tekst, kontakt (Vinderslevholmvej 57, 8620 Kjellerup,
     henrikkjaernielsen@hotmail.com), "Læs videre"-note om kilder
2. **Artikelsider** (7 stk.)
   - Topfoto i fuld bredde, kategori + læsetid, smal tekstkolonne (ca. 65 tegn/linje)
   - Faktabokse ("Vidste du?") med gylden venstrekant til at bryde teksten
   - Kildeliste nederst i hver artikel
   - Navigation til forrige/næste artikel
3. **Om Henriks Honning**
   - Henriks historie (nybegynder ~2014, skovejendommen ved Hinge), foto, kontaktinfo

## Artikelplan (lancering)

| # | Kategori | Titel | Grundlag |
|---|---|---|---|
| 01 | Bierne | Honningbiens liv — familien som én organisme | Nyskrevet |
| 02 | Natur | Bierne og biodiversiteten | Nyskrevet |
| 03 | Haven | En bivenlig have, sæson for sæson | Omskrivning af "Prydhaven" |
| 04 | Honningen | Mange slags honning | Omskrivning af "Mange slags honning" |
| 05 | Honningen | Verdens mest bæredygtige fødevare? | Omskrivning af blogindlæg |
| 06 | Bigården | Året i bigården | Bygger på "Højsæson" |
| 07 | Honningen | Fra blomst til glas | Nyskrevet |

Alle artikler skrives på baggrund af dansk faglitteratur (Danmarks Biavlerforenings
materialer m.fl.) med kildeliste. Faglige nøgletal (fx antal danske vilde bi-arter,
dronningens æglægning) verificeres mod kilderne under skrivningen, før de udgives —
det gælder også tallene i forsidens statbånd.

## Visuelt design (godkendt mockup: v4)

Referencemockup: `.superpowers/brainstorm/647-1784579847/content/design-mockup-v4.html`
— implementeringen skal ramme dette udtryk.

**Palette:**

| Rolle | Farve |
|---|---|
| Papir (baggrund) | `#f6f1e5` / dybere `#efe7d3` |
| Blæk (tekst) | `#241f14` / blød `#5c5240` |
| Sepia (illustrationer) | `#6b5334` / svag `#8a7250` |
| Honning (accent) | `#d9921e` / dyb `#b06e08` |
| Skovgrøn (kontrastflader) | `#1f2b1a` / `#2c3a24` |
| Mos | `#71804d` |

**Typografi:** Fraunces (display-serif; vægt 300-900 + kursiv) til overskrifter, citater
og annotationer; Inter til labels/UI-tekst; brødtekst i Fraunces let vægt. Store
skalaer: H1 op til ~116 px, kursive accenter i honninggylden.

**Håndtegnede illustrationer (da Vinci-studieblads-stil):** sepia-streg, krydsskravering
(SVG-patterns), let "ru" streg (feTurbulence + feDisplacementMap), konstruktionslinjer
og kursiverede annotationer med stiplede henvisningslinjer:

1. *Vitruviansk bi* (hero) — anatomisk studie i cirkel + kvadrat med annotationer
   (følehorn, facetøje, forvinge, honningmave, vokskirtler, pollenkurv) og kartouche
2. *Botanisk studieblad* (artikelindeks-margen) — hvidkløver med lille bi og flyverute
3. *Halmkube* (årshjul, baggrund, ~35 % opacitet)
4. *Honningcellens geometri* (citatsektion, baggrund, ~16 % opacitet)

Alle illustrationer er inline-SVG (ingen billedfiler), tegnet én gang og genbrugt som partials.

**Bevægelse (diskret):** streg-animation hvor illustrationerne "tegner sig selv"
(stroke-dashoffset), scroll-reveal via IntersectionObserver, "dryppende" scroll-indikator,
hover-effekter på artikelrækker og menu. Alt slås fra ved `prefers-reduced-motion`.

**Responsivt:** ét kolonneforløb under ~1000 px; margen-studieblad flyttes ind i flowet;
menu skjules på mobil (simpelt anker-fald eller burger afgøres under implementering — start uden burger,
menupunkterne er få).

## Teknisk arkitektur

```
HenriksHonning/
├── content/
│   ├── artikler/          # én .md pr. artikel
│   ├── index.njk          # forside
│   └── om.md              # Om/kontakt
├── _includes/
│   ├── layouts/           # base.njk, artikel.njk, side.njk
│   └── partials/          # nav, footer, statbånd, årshjul, SVG-illustrationer
├── assets/
│   ├── css/site.css       # ét håndskrevet stylesheet
│   ├── img/               # fotos (konverteres til webformat ved build)
│   └── fonts/             # Fraunces + Inter self-hostet (woff2)
├── eleventy.config.js
└── .github/workflows/deploy.yml
```

**Artikel-frontmatter:** `title`, `category`, `date`, `image`, `description` (uddrag).
Læsetid beregnes automatisk af et Eleventy-filter. Artikelindekset på forsiden genereres
af en collection sorteret efter dato, ældste først: den første artikel er 01, og en ny
artikel får automatisk det næste nummer og vises nederst i indekset.

**Deploy:** push til `main` → GitHub Actions kører `npx @11ty/eleventy` → udgiver `_site/`
til GitHub Pages. Eget domæne kan tilføjes senere via CNAME.

**Ingen afhængigheder i browseren:** ingen frameworks, ingen Google Fonts-kald
(self-hostede fonte), ingen cookies/tracking. Kun ~20 linjer vanilla JS til scroll-reveal.

**RSS:** feed genereres (eleventy-plugin-rss), så læsere kan følge nye artikler.

**SEO/tilgængelighed:** semantisk HTML, `lang="da"`, meta-beskrivelser pr. side,
alt-tekster på alle fotos, kontrast efter WCAG AA, synlige fokusmarkeringer.

## Fejlhåndtering og kanttilfælde

- Manglende artikelfoto → fald tilbage til gylden gradient-flade (som i mockups)
- 404-side i samme design med link til forsiden
- Byg fejler i CI → siden forbliver på seneste fungerende version (GitHub Pages-adfærd)

## Test og verifikation

- `npx @11ty/eleventy --serve` lokalt; visuel gennemgang af forside + alle artikler
- HTML-validering af det byggede output og tjek af interne links ved build
- Lighthouse-tjek (performance/a11y/SEO) som manuel verifikation før første udgivelse
- Responsiv-tjek ved 375 px, 768 px og 1440 px

## Uden for scope

- Webshop/betaling, kommentarfelt, nyhedsbrev, søgefunktion, CMS, flersprogethed
- Migrering af samtlige gamle blogindlæg (kun de udvalgte i artikelplanen)
- Domænekøb og DNS-opsætning (kan tilføjes senere)
