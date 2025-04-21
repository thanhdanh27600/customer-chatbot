import {FamilyContextManager} from "./context";

const paths = ["src/data/family.json"];

export async function chat(userInput: string): Promise<string> {
	try {
		// Initialize family context manager
		const familyManager = new FamilyContextManager(paths[0]);

		// Examples
		// console.log("Family Tree Description:");
		// console.log(familyManager.generateFamilyTreeDescription());

		// console.log("\nRelationship between John and Emily:");
		// console.log(familyManager.findRelationship("john_smith", "emily_smith"));

		const response = await familyManager.createChatWithFamilyContext(userInput);
		return response;
	} catch (error) {
		console.error("Error communicating with AI service:", error);
		return "I'm experiencing technical difficulties. Please try again later.";
	}
}
