const {
  ArtEngine,
  inputs,
  generators,
  renderers,
  exporters,
} = require("@hashlips-lab/art-engine");

const BASE_PATH = __dirname;

/**
 * for the asset background image file names:
 * - '__w1' is the rare backgrounds
 * - '__w3' is the common backgrounds
 *
 * the rare option's weight is 1 part of the total weight of 4 parts since we want it to appear 1 out of 4 times
 */
const ae = new ArtEngine({
  cachePath: `${BASE_PATH}/cache`,
  outputPath: `${BASE_PATH}/output`,
  useCache: false,

  inputs: {
    shrooms: new inputs.ImageLayersInput({
      assetsBasePath: `${BASE_PATH}/assets`,
    }),
  },

  generators: [
    // Define the generator plugin (ImageLayersAttributesGenerator) to generate attributes for each item
    new generators.ImageLayersAttributesGenerator({
      dataSet: "shrooms",
      startIndex: 1,
      endIndex: 10,
    }),
  ],

  renderers: [
    new renderers.ItemAttributesRenderer({
      name: (itemUid) => `Shroom ${itemUid}`,
      description: (attributes) => {
        return `This is a token with "${attributes["5_Background"][0]}" as Background`;
      },
    }),
    new renderers.ImageLayersRenderer({
      width: 880,
      height: 880,
    }),
  ],

  exporters: [
    new exporters.ImagesExporter(),
    new exporters.Erc721MetadataExporter({
      imageUriPrefix: "ipfs://__CID__/",
    }),
  ],
});

(async () => {
  // Run the Art Engine
  await ae.run();
  // Print performance metrics
  await ae.printPerformance();
})();
