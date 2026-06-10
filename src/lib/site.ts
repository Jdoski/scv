// Central site configuration — edit links, divisions, and contact info here.
export const site = {
  name: "Southern Connecticut Volleyball",
  shortName: "SCV",
  tagline: "Grass volleyball tournaments in Southern Connecticut",
  links: {
    volleyballLife: "https://scvdig.volleyballlife.com/tournaments/current",
    facebook: "https://www.facebook.com/sherwoodscv",
    instagram: "https://www.instagram.com/southernctvolleyball/",
  },
} as const;

// Divisions shown in the Free Agent board dropdown.
export const divisions = [
  "Men's A",
  "Men's BB",
  "Men's B",
  "Women's A",
  "Women's BB",
  "Women's B",
  "Coed",
  "Juniors",
] as const;

export type Division = (typeof divisions)[number];
