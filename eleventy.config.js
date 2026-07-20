import { HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

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

  // Nulpolstret to-cifret nummer (01, 02, …) til artikelindekset
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: { name: "artiklerSorteret", limit: 0 },
    metadata: {
      language: "da",
      title: "Henriks Honning",
      subtitle: "Artikler om honningbier, natur og biodiversitet.",
      base: "https://henrikkjaernielsen.github.io/HenriksHonning/",
      author: { name: "Henrik Kjær Nielsen" },
    },
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto", 800, 1400],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  eleventyConfig.addPassthroughCopy("assets");

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
