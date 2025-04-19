import * as readline from "readline";
import {servicesContext} from "./services/context";
import {botConfig, chat} from "./services/root";
import {ChatMessage} from "./utils/types";

// Main function to run the customer support bot
async function main() {
	console.log("Customer Support Bot Starting...");

	// Initialize conversation history
	const conversationHistory: ChatMessage[] = [
		{role: "system", content: botConfig.systemPrompt},
	];

	// Set up readline interface for CLI chat
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log(
		"Customer Support Bot is ready! Type your message (or 'exit' to quit):"
	);

	// Chat loop
	const promptUser = () => {
		rl.question("Customer: ", async (input) => {
			if (input.toLowerCase() === "exit") {
				console.log("Thank you for using our Customer Support Bot!");
				rl.close();
				return;
			}

			// Add user message to history
			conversationHistory.push({role: "user", content: input});

			// Get AI response
			const response = await chat(
				[...conversationHistory],
				servicesContext,
				input
			);

			// Add AI response to history
			conversationHistory.push({role: "assistant", content: response});

			// Display response
			console.log(`Support Agent: ${response}\n`);

			// Manage conversation history length (keep it within token limits)
			if (conversationHistory.length > 10) {
				// Keep system prompt and last 4 exchanges (8 messages)
				const systemPrompt = conversationHistory[0];
				conversationHistory.splice(1, conversationHistory.length - 9);
				conversationHistory.unshift(systemPrompt);
			}

			promptUser();
		});
	};

	promptUser();
}

main().catch(console.error);
