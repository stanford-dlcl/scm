const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const postcss = require("postcss");
const cssnano = require("cssnano");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = function (eleventyConfig) {
  eleventyConfig.setLayoutResolution(false);
  eleventyConfig.addPassthroughCopy({
    "./assets": "/assets",
    "node_modules/@fontsource/gravitas-one/files": "/bundle/files",
    "node_modules/@fontsource/gentium-plus/files": "/bundle/files",
  });
  eleventyConfig.addWatchTarget("./styles/");

  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addPlugin(pluginBundle, {
    transforms: [
      async function (content) {
        if (this.type === "css") {
          let { css } = await postcss([
            postcssPresetEnv({ stage: 1 }),
            cssnano({ preset: "default" }),
          ]).process(content, { from: this.page.inputPath, to: null });
          return css;
        }
        return content;
      },
    ],
  });
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addCollection("musicSources", (collectionApi) => {
    const musicSources = new Set();
    collectionApi
      .getFilteredByTags("music")
      .forEach((item) => musicSources.add(item.data.Source));
    return musicSources;
  });

  return {
    dir: {
      input: "content",
      data: "../_data",
      includes: "../_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/decolonizationunderground/",
    passthroughFileCopy: true,
  };
};
