export default function (eleventyConfig) {
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
