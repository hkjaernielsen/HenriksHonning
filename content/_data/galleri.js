// Galleriet på /billeder/: fire årstidssektioner.
// format: "bred" (16/10), "hoej" (3/4), "hero" (21/10) — span: kolonner af 12.
export default [
  {
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
    periode: "Maj–juli",
    titel: "Bigården i skoven",
    intro:
      "Staderne står spredt på ejendommen — i skovbryn, på skrænter og i den gamle have, hvor rhododendron og ærenpris blomstrer.",
    billeder: [
      {
        fil: "stade-aerenpris", format: "hero", span: 12,
        tekst: "Staderne i æblehaven med et tæppe af tveskægget ærenpris — de grønne kasser anes hele vejen op gennem græsset.",
        alt: "Grønt bistade i højt græs med et blåt tæppe af tveskægget ærenpris, hus og garage bag træerne",
      },
      {
        fil: "haven-maj", format: "bred", span: 6,
        tekst: "Haven i maj — rhododendron og de første slåede stier.",
        alt: "Frodig have med rød og lilla rhododendron og en nyslået sti gennem højt græs",
      },
      {
        fil: "ejendommen-fra-luften", format: "bred", span: 6,
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
    periode: "August",
    titel: "Høsten",
    intro:
      "Magasinerne bæres ind, tavlerne skæres, og honningen får lov at løbe — fra ramme til glas uden omveje.",
    billeder: [
      {
        fil: "magasiner-stablet", format: "hoej", span: 4,
        tekst: "Magasinerne stables i bryggerset — klar til at blive skrællet og slynget.",
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
        tekst: "Glas klar til at blive fyldt op med flydende honning — august måneds fineste øjeblik.",
        alt: "Glas med lodrette stykker tavlehonning på spisebordet og en buket blomster i baggrunden",
      },
    ],
  },
  {
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
