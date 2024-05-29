import type { Character } from "@/models";
import charactersModels from "@/assets/characters.json";
import { isNone } from "@/utils";
import { defineStore } from "pinia";
import sampleSize from "lodash.samplesize";

interface GambaStore {
  // Active character ID that is selected.
  actives: string[];
  // Character ID that is selected.
  selected: string[];
}

// Remove all the other MC.
const DUPLICATES = ["8002", "8003", "8006"];
const defaultActives = Object.keys(charactersModels).filter((id) => !DUPLICATES.includes(id));

function setStorageData(actives: string[]) {
  localStorage.setItem("qqgamba.actives", JSON.stringify(actives));
}

function getStorageDataOrDefaults(): string[] {
  const actives = localStorage.getItem("qqgamba.actives");
  if (actives) {
    return JSON.parse(actives);
  }
  return defaultActives;
}

export const useGambaStore = defineStore("gamba", {
  state: (): GambaStore => {
    return {
      actives: getStorageDataOrDefaults(),
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
      setStorageData(this.actives);
    },
    randomize() {
      this.selected = sampleSize(this.actives, 8);
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
      // Update local storage.
      setStorageData(this.actives);
    }
  }
});
