import {
  type ScoreCharacter,
  type ScoreCharacterJSON,
  type StatsType,
  type StatsTypeDict,
  StatsTypeList
} from "@/models/scores";

// Custom error
export class ScoreValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScoreValidationError";
  }
}

export type ScoringData = {
  id: string;
  data: ScoreCharacter;
};

function validateWeightData(chara: string, data: StatsTypeDict) {
  for (const [statsName, statsValue] of Object.entries(data)) {
    if (!StatsTypeList.includes(statsName as StatsType)) {
      throw new ScoreValidationError(`${chara}: Invalid stats name: ${statsName}`);
    }

    if (typeof statsValue !== "number") {
      throw new ScoreValidationError(`${chara}: Invalid stats value: ${statsValue}`);
    }

    if (statsValue < 0.0) {
      throw new ScoreValidationError(
        `${chara}: Invalid stats value: ${statsValue} (Must be greater or equal to zero)`
      );
    }

    if (statsValue > 1.0) {
      throw new ScoreValidationError(
        `${chara}: Invalid stats value: ${statsValue} (Must be less or equal to one)`
      );
    }
  }
}

export function validateScoreJSON(scoreData: ScoreCharacterJSON) {
  for (const [characterId, characterData] of Object.entries(scoreData)) {
    if (isNaN(parseInt(characterId))) {
      throw new ScoreValidationError(`Invalid character ID: ${characterId}`);
    }

    if (!characterData.main) {
      throw new ScoreValidationError(`${characterId}: Missing main stats`);
    }

    if (!characterData.weight) {
      throw new ScoreValidationError(`${characterId}: Missing substats weight`);
    }

    // Check main stats
    if (!characterData.main["1"]) {
      throw new ScoreValidationError(`${characterId}: Missing head stats`);
    }
    validateWeightData(`${characterId}.main.1`, characterData.main["1"]);
    if (!characterData.main["2"]) {
      throw new ScoreValidationError(`${characterId}: Missing hand stats`);
    }
    validateWeightData(`${characterId}.main.2`, characterData.main["2"]);
    if (!characterData.main["3"]) {
      throw new ScoreValidationError(`${characterId}: Missing body stats`);
    }
    validateWeightData(`${characterId}.main.3`, characterData.main["3"]);
    if (!characterData.main["4"]) {
      throw new ScoreValidationError(`${characterId}: Missing foot stats`);
    }
    validateWeightData(`${characterId}.main.4`, characterData.main["4"]);
    if (!characterData.main["5"]) {
      throw new ScoreValidationError(`${characterId}: Missing planar orb stats`);
    }
    validateWeightData(`${characterId}.main.5`, characterData.main["5"]);
    if (!characterData.main["6"]) {
      throw new ScoreValidationError(`${characterId}: Missing planar rope stats`);
    }
    validateWeightData(`${characterId}.main.6`, characterData.main["6"]);

    // Check substats
    validateWeightData(`${characterId}.weight`, characterData.weight);
  }
}

type StatsMax = {
  key: string;
  value: number;
};

type StatsMaxKeyMap = { [key: string]: StatsMax };

export function calculateMaximumPossibleValues(scoreData: Omit<ScoreCharacter, "max">): number {
  // Get the possible max score from artifacts/relics combinations.
  // We will assume that the player has 4 substats available.
  // And we select the best possible main stats for each slot.

  // Main stats
  const mainStats = scoreData.main;
  const mainStatsMax: StatsMaxKeyMap = {};

  for (const [key, value] of Object.entries(mainStats["1"])) {
    const statMax = mainStatsMax["1"];
    if (!statMax) {
      mainStatsMax["1"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["1"] = { key, value };
    }
  }
  for (const [key, value] of Object.entries(mainStats["2"])) {
    const statMax = mainStatsMax["2"];
    if (!statMax) {
      mainStatsMax["2"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["2"] = { key, value };
    }
  }
  for (const [key, value] of Object.entries(mainStats["3"])) {
    const statMax = mainStatsMax["3"];
    if (!statMax) {
      mainStatsMax["3"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["3"] = { key, value };
    }
  }
  for (const [key, value] of Object.entries(mainStats["4"])) {
    const statMax = mainStatsMax["4"];
    if (!statMax) {
      mainStatsMax["4"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["4"] = { key, value };
    }
  }
  for (const [key, value] of Object.entries(mainStats["5"])) {
    const statMax = mainStatsMax["5"];
    if (!statMax) {
      mainStatsMax["5"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["5"] = { key, value };
    }
  }
  for (const [key, value] of Object.entries(mainStats["6"])) {
    const statMax = mainStatsMax["6"];
    if (!statMax) {
      mainStatsMax["6"] = { key, value };
      continue;
    }
    if (statMax && value > statMax.value) {
      mainStatsMax["6"] = { key, value };
    }
  }

  // Substats
  const subStats = scoreData.weight;
  // sort by the biggest weight
  const subStatsSorted = Object.entries(subStats).sort((a, b) => b[1] - a[1]);
  const subStatsMax: { [key: string]: number } = {};
  for (let i = 0; i < 5; i++) {
    const [subStat, weight] = subStatsSorted[i];
    subStatsMax[subStat] = (4 + 2 * 0.1) * weight;
  }
  // Sum all values of substats
  const subStatsMaxSum = Object.values(subStatsMax).reduce((a, b) => a + b, 0) * 6;
  const mainStatsMaxSum = Object.values(mainStatsMax).reduce((a, b) => a + b.value, 0) * 6;
  const maxScore = (subStatsMaxSum / mainStatsMaxSum) * 0.5 * 6 + 2;

  return Number(maxScore.toFixed(2));
}
