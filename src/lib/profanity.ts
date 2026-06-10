// Profanity filter for free agent board submissions.
// Add or remove words from the lists below to tune it.

// Matched anywhere in the text, even inside other words.
const strongWords = [
  "fuck",
  "shit",
  "cunt",
  "bitch",
  "asshole",
  "faggot",
  "nigger",
  "nigga",
  "whore",
  "slut",
  "pussy",
  "dickhead",
  "motherfucker",
  "cocksucker",
  "retard",
  "twat",
  "wanker",
  "dumbass",
  "jackass",
];

// Matched only as whole words, so real names like "Dickinson" pass.
const wordOnly = [
  "ass",
  "dick",
  "cock",
  "fag",
  "hoe",
  "tit",
  "tits",
  "penis",
  "vagina",
  "anal",
  "cum",
  "rape",
];

// Common letter substitutions people use to sneak words past filters.
const leetMap: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  $: "s",
  "!": "i",
  "+": "t",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((c) => leetMap[c] ?? c)
    .join("");
}

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  const lettersOnly = normalized.replace(/[^a-z]/g, "");
  if (strongWords.some((w) => lettersOnly.includes(w))) return true;
  const words = normalized.split(/[^a-z]+/).filter(Boolean);
  return words.some((w) => wordOnly.includes(w));
}
