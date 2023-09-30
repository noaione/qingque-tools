import type {
  Character,
  MainAffixKey,
  ScoreCharacter,
  ScoreCharacterJSON,
  StatsTypeDict
} from "@/models";
import charactersModels from "@/assets/characters.json";
import { calculateMaximumPossibleValues, isNone } from "@/utils";
import { defineStore } from "pinia";

interface GambaStore {
  // Active character ID that is selected.
  actives: string[];
  // Character ID that is selected.
  selected: string[];
}

// Remove all the other MC.
const DUPLICATES = ["8002", "8003", "8004"];
const defaultActives = Object.keys(charactersModels).filter((id) => !DUPLICATES.includes(id));

export const useGambaStore = defineStore("gamba", {
  state: (): GambaStore => {
    return {
      actives: defaultActives,
      selected: []
    };
  },
  getters: {
    selectedWithModel(): Character[] {
      return this.selected
        .map((id) => charactersModels[id as keyof typeof charactersModels])
        .filter((cc) => !isNone(cc)) as Character[];
    }
  },
  actions: {
    defaults() {
      this.actives = defaultActives;
      this.selected = [];
    },
    randomize() {
      this.selected = this.actives.sort(() => Math.random() - 0.5).slice(0, 8);
    },
    reset() {
      this.selected = [];
    },
    toggleActive(id: string) {
      if (this.actives.includes(id)) {
        this.actives = this.actives.filter((aid) => aid !== id);
      } else {
        this.actives.push(id);
      }
    }
  }
});
