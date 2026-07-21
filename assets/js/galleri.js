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
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
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
