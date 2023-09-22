export type CharacterPath = "Warrior" | "Rogue" | "Mage" | "Shaman" | "Warlock" | "Knight" | "Priest";
export type CharacterElement = "Physical" | "Fire" | "Ice" | "Thunder" | "Wind" | "Quantum" | "Imaginary";

export type Character = {
	id: string;
	name: string;
	tag: string;
	rarity: number;
	path: CharacterPath;
	element: CharacterElement;
	max_sp: number;
	ranks: string[];
	skills: string[];
	skill_trees: string[];
	icon: string;
	preview: string;
	portrait: string;
};

export function getCharacterElement(element: CharacterElement) {
	switch (element) {
		case "Thunder":
			return "Lightning";
		default:
			return element;
	}
}

export function getCharacterPath(path: CharacterPath) {
	switch (path) {
		case "Warrior":
			return "Destruction";
		case "Rogue":
			return "Hunt";
		case "Mage":
			return "Erudition";
		case "Shaman":
			return "Harmony";
		case "Warlock":
			return "Nihility";
		case "Knight":
			return "Preservation";
		case "Priest":
			return "Abundance";
	}
}
