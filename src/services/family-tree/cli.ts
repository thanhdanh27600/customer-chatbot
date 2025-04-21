import * as readline from "readline";
import {chat} from "./root";

// Main function to run the family bot
async function main() {
	console.log("Family Bot Starting...");

	// Set up readline interface for CLI chat
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log("Family Bot is ready! Type your message (or 'exit' to quit):");

	// Chat loop
	const promptUser = () => {
		rl.question("User: ", async (input) => {
			if (input.toLowerCase() === "exit") {
				console.log("Thank you for using Family Bot!");
				rl.close();
				return;
			}
			// Get AI response
			const response = await chat(input);
			// Display response
			console.log(`Family Bot: ${response}\n`);
			promptUser();
		});
	};

	promptUser();
}

main().catch(console.error);
