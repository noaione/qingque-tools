import type { Character, MainAffixKey, ScoreCharacter, ScoreCharacterJSON, StatsTypeDict } from "@/models";
import charactersModels from "@/assets/characters.json";
import { calculateMaximumPossibleValues, isNone } from "@/utils";
import { defineStore } from "pinia";

export interface SCStore {
  id: string;
  data: Omit<ScoreCharacter, "max">;
  max: number;
}

export interface SCStoreWithModel extends SCStore {
  model: Character;
}

interface ScoreStore {
  scores: SCStore[];
  cIdx: string | null; // index
}

const defaultScore: ScoreCharacter = {
  main: {
    "1": {
      HPDelta: 0
    },
    "2": {
      AttackDelta: 0
    },
    "3": {
      HPAddedRatio: 0,
      AttackAddedRatio: 0,
      DefenceAddedRatio: 0,
      CriticalChanceBase: 0,
      CriticalDamageBase: 0,
      HealRatioBase: 0,
      StatusProbabilityBase: 0
    },
    "4": {
      HPAddedRatio: 0,
      AttackAddedRatio: 0,
      DefenceAddedRatio: 0,
      SpeedDelta: 0
    },
    "5": {
      HPAddedRatio: 0,
      AttackAddedRatio: 0,
      DefenceAddedRatio: 0,
      PhysicalAddedRatio: 0,
      FireAddedRatio: 0,
      IceAddedRatio: 0,
      ThunderAddedRatio: 0,
      WindAddedRatio: 0,
      QuantumAddedRatio: 0,
      ImaginaryAddedRatio: 0
    },
    "6": {
      BreakDamageAddedRatioBase: 0,
      SPRatioBase: 0,
      HPAddedRatio: 0,
      AttackAddedRatio: 0,
      DefenceAddedRatio: 0
    }
  },
  weight: {
    HPDelta: 0,
    AttackDelta: 0,
    DefenceDelta: 0,
    HPAddedRatio: 0,
    AttackAddedRatio: 0,
    DefenceAddedRatio: 0,
    SpeedDelta: 0,
    CriticalChanceBase: 0,
    CriticalDamageBase: 0,
    StatusProbabilityBase: 0,
    StatusResistanceBase: 0,
    BreakDamageAddedRatioBase: 0
  },
  max: 0.0
};

export const useScoresStore = defineStore("scores", {
  state: (): ScoreStore => {
    return {
      scores: [],
      cIdx: null
    };
  },
  getters: {
    current(state): SCStore | undefined {
      const selected = state.scores.find((score) => score.id === state.cIdx);
      if (isNone(selected)) return undefined;

      return {
        ...selected,
        // recalibratee the max value
        max: calculateMaximumPossibleValues(selected.data)
      };
    },
    currentIndex(state): number | undefined {
      return state.scores.findIndex((score) => score.id === state.cIdx);
    },
    currentWithModel(): SCStoreWithModel | undefined {
      const current = this.current;
      if (!current) return undefined;
      const model = charactersModels[current.id as keyof typeof charactersModels] as Character;
      if (!model) return undefined;
      return {
        ...current,
        model
      };
    },
    loaded(state): boolean {
      return state.scores.length > 0;
    },
    scoresWithModel(state): SCStoreWithModel[] {
      return state.scores.map((score) => {
        const model = charactersModels[score.id as keyof typeof charactersModels] as Character;
        return {
          ...score,
          model
        };
      });
    }
  },
  actions: {
    cleanData() {
      this.scores = [];
      this.cIdx = null;
    },
    /**
     * Reset the store to its initial state with JSON data
     * @param jsonData JSON data to load
     */
    fromJSON(jsonData: ScoreCharacterJSON) {
      // Remove TB Male (Fire) and TB Fem (Phys)
      const dedupeChars = ["8002", "8003"];
      const scores: SCStore[] = Object.entries(jsonData)
        .map(([id, info]) => {
          if (dedupeChars.includes(id)) return null;
          return {
            id,
            data: {
              main: info.main,
              weight: info.weight
            },
            max: calculateMaximumPossibleValues(info)
          };
        })
        .filter((score) => score !== null) as SCStore[];

      this.scores = scores;
      // auto select the first character
      this.cIdx = scores[0]?.id;
    },
    /**
     * Set the current character
     * @param id Character ID
     */
    setCurrent(id: string) {
      console.log("setCurrent", id);
      this.cIdx = id;
    },
    /**
     * Update the current character's weights
     * @param weights New weights
     * @param id Character ID (optional)
     */
    updateCurrentWeight(weights: StatsTypeDict, id?: string) {
      const selId = id ?? this.cIdx;
      const index = this.scores.findIndex((score) => score.id === selId);
      if (index === -1) return;

      // Sync if Trailblazer
      const score = this.scores[index];
      score.data.weight = weights;
      score.max = calculateMaximumPossibleValues(score.data);
      this.scores[index] = score;
    },
    /**
     * Update the current/selected character's main stats weights
     * @param index Main stat index
     * @param weights New weights
     * @param id Character ID (optional)
     */
    updateCurrentMain(index: string, weights: StatsTypeDict, id?: string) {
      const selId = id ?? this.cIdx;
      const scoreIdx = this.scores.findIndex((score) => score.id === selId);
      if (scoreIdx === -1) return;

      const score = this.scores[scoreIdx];
      score.data.main[index as MainAffixKey] = weights;
      score.max = calculateMaximumPossibleValues(score.data);
      this.scores[scoreIdx] = score;
    },
    removeCharacter(id: string) {
      const index = this.scores.findIndex((score) => score.id === id);
      if (index === -1) return;

      const min = index - 1 < 0 ? undefined : index - 1;
      const newId = min !== undefined ? this.scores[min].id : null;

      // Remove the character
      this.scores.splice(index, 1);
      if (newId === null && this.scores.length > 0) {
        this.cIdx = this.scores[0].id;
      } else {
        this.cIdx = newId;
      }
    },
    addCharacter(id: string) {
      const index = this.scores.findIndex((score) => score.id === id);
      if (index !== -1) return;

      // Copy dict
      const score = JSON.parse(JSON.stringify(defaultScore)) as ScoreCharacter;
      const scores = this.scores;
      // Push the new character
      scores.push({
        id,
        data: score,
        max: calculateMaximumPossibleValues(score)
      });

      // Sort the characters
      scores.sort((a, b) => {
        const aModel = Number(a.id);
        const bModel = Number(b.id);
        return aModel - bModel;
      });

      this.scores = scores;
      // Set the current character
      this.cIdx = id;
    }
  }
});
