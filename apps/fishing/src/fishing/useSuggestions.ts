import { useLiveQuery } from "dexie-react-hooks";
import { fishingRepository } from "./repository";
import { collectSuggestions, type Suggestions } from "./trips";

const empty: Suggestions = { spots: [], species: [], tackles: [] };

export function useSuggestions(): Suggestions {
  return useLiveQuery(async () => collectSuggestions(await fishingRepository.findAll()), []) ?? empty;
}
