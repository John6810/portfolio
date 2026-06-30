import en, { type Dict } from "./en";
import fr from "./fr";
import ja from "./ja";

export type Locale = "fr" | "en" | "ja";

export const locales: Locale[] = ["fr", "en", "ja"];

export const dicts: Record<Locale, Dict> = { fr, en, ja };

// Display metadata for the language switcher + <html lang> + routing.
export const localeMeta: Record<
  Locale,
  { label: string; flag: string; htmlLang: string; path: string }
> = {
  fr: { label: "FR", flag: "/icons/flag-fr.svg", htmlLang: "fr", path: "/" },
  en: { label: "EN", flag: "/icons/flag-gb.svg", htmlLang: "en", path: "/en" },
  ja: { label: "JP", flag: "/icons/flag-jp.svg", htmlLang: "ja", path: "/ja" },
};
