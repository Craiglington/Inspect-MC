import { SNBT, SNBTValue } from "../../../models/snbt";

interface Changelog extends SNBT {
  Changelog: { [key: string]: ReleaseVersion };
}

interface ReleaseVersion extends SNBT {
  releaseDate: string;
  features?: SNBTValue;
  bugFixes?: SNBTValue;
}

/**
 * The Changelog is for updates relevant to the user, not the code.
 */
export const ChangeLogData: Changelog = {
  Changelog: {
    "1.4.0": {
      releaseDate: "",
      features: ["Added support for Minecraft version 26.1."]
    },
    "1.3.0": {
      releaseDate: "Feb 16, 2026",
      features: [
        "Added a changelog accessible through the help dialog or via url(/Inspect-MC/changelog)."
      ]
    },
    "1.2.1": {
      releaseDate: "Feb 14, 2026",
      bugFixes: [
        "Fixed spaces appearing in grid column headers due to a default AG Grid setting."
      ]
    },
    "1.2.0": {
      releaseDate: "Feb 12, 2026",
      features: [
        "Added a zoom feature to the map that is controlled by scrolling on the map.",
        "Increased the maximum map length in chunks from 25 to 64.",
        'Replaced the "Nothing to See Here" disclaimer with a title and a description for each page.',
        "Upgraded map performance by using a least-recently-used cache to store chunk images and an asynchronous queue to fetch chunk images."
      ],
      bugFixes: [
        "Fixed the maximum length of the map in chunks not being applied correctly in certain scenarios."
      ]
    },
    "1.1.0": {
      releaseDate: "Jan 27, 2026",
      features: [
        "The map now loads chunks while dragging. It no longer waits for dragging to end to load the chunks of the viewable area."
      ],
      bugFixes: [
        "Map chunks load much faster after fixing a bug causing a miscalculation of the y level from a height map."
      ]
    },
    "1.0.0": {
      releaseDate: "Jan 25, 2026",
      features: [
        "Inspect MC launched with the following capabilities:",
        [
          {
            feature: "World Info Component",
            description:
              "Displays general world information. Available via tab or url(/Inspect-MC/world-info)."
          },
          {
            feature: "Map Component",
            description:
              "Displays world maps of all three Minecraft dimensions. Available via tab or url(/Inspect-MC/map).",
            details: [
              "The map can be configured with the following settings:",
              [
                {
                  setting: "Show Crosshairs",
                  description:
                    "When enabled, crosshairs display on the map and show the exact location of the map's current coordinates."
                },
                {
                  setting: "Map Dimension",
                  description:
                    "Select from The Overworld, The Nether, or The End dimensions."
                },
                {
                  setting: "Starting X Coordinate",
                  description: "Select the starting x coordinate of the map."
                },
                {
                  setting: "Starting Y Level",
                  description: "Select the starting y level of the map."
                },
                {
                  setting: "Starting Z Coordinate",
                  description: "Select the starting z coordinate of the map."
                },
                {
                  setting: "Map Type",
                  description:
                    "Select between various map types including Original, Blocks Only, and No Water."
                }
              ],
              "The map displays the current coordinates at the top left of the screen. These can be adjusted to view any location of a Minecraft world at any height.",
              "The map is draggable with a mouse or track pad."
            ]
          },
          {
            feature: "Player Data Component",
            description:
              "Displays general player information. Available via tab or url(/Inspect-MC/player-data).",
            details: [
              "The player data component can be configured with the following settings:",
              [
                {
                  setting: "Player",
                  description:
                    "Choose a player from a list of Minecraft usernames."
                }
              ]
            ]
          },
          {
            feature: "Stats Component",
            description:
              "Display players' statistics. Available via tab or url(/Inspect-MC/stats).",
            details: [
              "The stats component can be configured with the following settings:",
              [
                {
                  setting: "Players",
                  description:
                    "Choose up to 10 players from a list of Minecraft usernames."
                },
                {
                  setting: "Category",
                  description: [
                    "Choose from the following list of Minecraft statistic categories:",
                    [
                      "Broken",
                      "Crafted",
                      "Dropped",
                      "General",
                      "Killed",
                      "Killed By",
                      "Mined",
                      "Picked Up",
                      "Used"
                    ]
                  ]
                }
              ],
              "Statistics can be sorted and filtered by player or statistic thanks to AG Grid."
            ]
          },
          {
            feature: "Advancements Component",
            description:
              "Displays players' advancements. Available via tab or url(/Inspect-MC/advancements).",
            details: [
              "The advancements component can be configured with the following settings:",
              [
                {
                  setting: "Players",
                  description:
                    "Choose up to 10 players from a list of Minecraft usernames."
                },
                {
                  setting: "Category",
                  description: [
                    "Choose from the following list of Minecraft advancement categories:",
                    [
                      "Minecraft",
                      "The Nether",
                      "The End",
                      "Adventure",
                      "Husbandry",
                      "Recipes"
                    ]
                  ]
                }
              ],
              "Advancements can be sorted and filtered by player or advancment thanks to AG Grid."
            ]
          },
          "All component settings are cached in the browser and used to repopulate components on refresh.",
          {
            feature: "Upload Dialog",
            description:
              "A popup used to upload Minecraft world folders. Available via tab."
          },
          "Light and dark modes available via tab.",
          {
            feature: "Help Dialog",
            description:
              "A popup used to display general app information and disclaimers. Available via tab."
          }
        ]
      ]
    }
  }
};
