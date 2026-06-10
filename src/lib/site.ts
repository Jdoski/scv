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

// Division setup: Saturdays run Men's + Women's, Sundays run Revco.
const levels = ["U18", "BB", "A", "AA", "Open"] as const;

export const mensDivisions = levels.map((l) => `Men's ${l}`);
export const womensDivisions = levels.map((l) => `Women's ${l}`);
export const revcoDivisions = levels.map((l) => `Revco ${l}`);

export const divisions = [...mensDivisions, ...womensDivisions, ...revcoDivisions];

// Every tournament automatically offers the divisions for its day of week.
export function divisionsForDate(dateStr: string): string[] {
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  if (day === 6) return [...mensDivisions, ...womensDivisions]; // Saturday
  if (day === 0) return [...revcoDivisions]; // Sunday
  return [...divisions]; // any other day: offer everything
}
