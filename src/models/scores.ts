export type StatsType =
  | "HPDelta"
  | "AttackDelta"
  | "DefenceDelta"
  | "SpeedDelta"
  | "HPAddedRatio"
  | "AttackAddedRatio"
  | "DefenceAddedRatio"
  | "CriticalChanceBase"
  | "CriticalDamageBase"
  | "StatusProbabilityBase"
  | "StatusResistanceBase"
  | "BreakDamageAddedRatioBase"
  | "HealRatioBase" // Body piece only
  /// Planar orb only stats starts here
  | "PhysicalAddedRatio"
  | "FireAddedRatio"
  | "IceAddedRatio"
  | "ThunderAddedRatio"
  | "WindAddedRatio"
  | "QuantumAddedRatio"
  | "ImaginaryAddedRatio"
  /// Planar rope only stats starts here
  | "SPRatioBase"; // Planar rope only

export const StatsTypeList: StatsType[] = [
  "HPDelta",
  "AttackDelta",
  "DefenceDelta",
  "SpeedDelta",
  "HPAddedRatio",
  "AttackAddedRatio",
  "DefenceAddedRatio",
  "CriticalChanceBase",
  "CriticalDamageBase",
  "StatusProbabilityBase",
  "StatusResistanceBase",
  "BreakDamageAddedRatioBase",
  "HealRatioBase", // Body piece only
  /// Planar orb only stats starts here
  "PhysicalAddedRatio",
  "FireAddedRatio",
  "IceAddedRatio",
  "ThunderAddedRatio",
  "WindAddedRatio",
  "QuantumAddedRatio",
  "ImaginaryAddedRatio",
  /// Planar rope only stats starts here
  "SPRatioBase" // Planar rope only
];

export type StatsTypeDict = {
  [stats in StatsType]?: number;
};

export type ScoreMainAffix = {
  // Head
  "1": StatsTypeDict;
  // Hand
  "2": StatsTypeDict;
  // Body
  "3": StatsTypeDict;
  // Foot
  "4": StatsTypeDict;
  // Planar Orb
  "5": StatsTypeDict;
  // Planar Rope
  "6": StatsTypeDict;
};

export type MainAffixKey = keyof ScoreMainAffix;

export type ScoreCharacter = {
  // All the main stats weight
  main: ScoreMainAffix;
  // All the substats weight
  weight: StatsTypeDict;
  // The maximum possible value of a relic
  max: number;
};

export type ScoreCharacterJSON = { [characterId: string]: ScoreCharacter };

export function statsTypeToName(stats: StatsType): string {
  switch (stats) {
    case "HPDelta":
      return "HP";
    case "AttackDelta":
      return "ATK";
    case "DefenceDelta":
      return "DEF";
    case "SpeedDelta":
      return "SPD";
    case "HPAddedRatio":
      return "HP%";
    case "AttackAddedRatio":
      return "ATK%";
    case "DefenceAddedRatio":
      return "DEF%";
    case "CriticalChanceBase":
      return "CRIT Rate";
    case "CriticalDamageBase":
      return "CRIT DMG";
    case "StatusProbabilityBase":
      return "EHR";
    case "StatusResistanceBase":
      return "RES";
    case "BreakDamageAddedRatioBase":
      return "Break Effect";
    case "HealRatioBase":
      return "Healing Rate";
    case "PhysicalAddedRatio":
      return "Physical DMG";
    case "FireAddedRatio":
      return "Fire DMG";
    case "IceAddedRatio":
      return "Ice DMG";
    case "ThunderAddedRatio":
      return "Thunder DMG";
    case "WindAddedRatio":
      return "Wind DMG";
    case "QuantumAddedRatio":
      return "Quantum DMG";
    case "ImaginaryAddedRatio":
      return "Imaginary DMG";
    case "SPRatioBase":
      return "Energy Regen";
    default:
      return "???";
  }
}

export function statsTypeToIcon(stats: StatsType): string {
  const basePath = "icon/property";
  switch (stats) {
    case "HPDelta":
    case "HPAddedRatio":
      return `${basePath}/IconMaxHP.png`;
    case "AttackDelta":
    case "AttackAddedRatio":
      return `${basePath}/IconAttack.png`;
    case "DefenceDelta":
    case "DefenceAddedRatio":
      return `${basePath}/IconDefence.png`;
    case "SpeedDelta":
      return `${basePath}/IconSpeed.png`;
    case "CriticalChanceBase":
      return `${basePath}/IconCriticalChance.png`;
    case "CriticalDamageBase":
      return `${basePath}/IconCriticalDamage.png`;
    case "StatusProbabilityBase":
      return `${basePath}/IconStatusProbability.png`;
    case "StatusResistanceBase":
      return `${basePath}/IconStatusResistance.png`;
    case "BreakDamageAddedRatioBase":
      return `${basePath}/IconBreakUp.png`;
    case "HealRatioBase":
      return `${basePath}/IconHealRatio.png`;
    case "PhysicalAddedRatio":
      return `${basePath}/IconPhysicalAddedRatio.png`;
    case "FireAddedRatio":
      return `${basePath}/IconFireAddedRatio.png`;
    case "IceAddedRatio":
      return `${basePath}/IconIceAddedRatio.png`;
    case "ThunderAddedRatio":
      return `${basePath}/IconThunderAddedRatio.png`;
    case "WindAddedRatio":
      return `${basePath}/IconWindAddedRatio.png`;
    case "QuantumAddedRatio":
      return `${basePath}/IconQuantumAddedRatio.png`;
    case "ImaginaryAddedRatio":
      return `${basePath}/IconImaginaryAddedRatio.png`;
    case "SPRatioBase":
      return `${basePath}/IconEnergyRecovery.png`;
  }
}
