import OpenAI from "openai";
import {botConfig, config} from "../utils/config";
import {executeFunction, functions} from "../utils/functions";
import {ChatMessage} from "../utils/types";
import {
	detectScenarioType,
	getEnhancedSystemPrompt,
	getTemperatureForScenario,
} from "./optimized-prompts";

const openai = new OpenAI({
	baseURL: config.openaiBaseUrl,
	apiKey: config.openaiApiKey,
});

export async function chat(
	messages: ChatMessage[],
	servicesContext: string,
	userInput: string // Add this parameter
): Promise<string> {
	try {
		// Get the appropriate enhanced prompt based on user input
		const enhancedSystemPrompt = getEnhancedSystemPrompt(
			botConfig.systemPrompt,
			userInput,
			servicesContext
		);

		const systemMessageIndex = messages.findIndex(
			(msg) => msg.role === "system"
		);
		if (systemMessageIndex >= 0) {
			messages[systemMessageIndex].content = enhancedSystemPrompt;
		} else {
			messages.unshift({
				role: "system",
				content: enhancedSystemPrompt,
			});
		}
		const scenarioType = detectScenarioType(userInput);
		const temperature = getTemperatureForScenario(scenarioType);

		console.log(`Detected scenario: ${scenarioType}`);
		console.log(`Using temperature: ${temperature}`);

		const response = await openai.chat.completions.create({
			model: config.openaiModel,
			messages: messages,
			max_tokens: botConfig.maxTokens,
			temperature,
			tools: functions.map((func) => ({type: "function", function: func})),
			tool_choice: "auto",
		});
		// Process the response
		let result: string =
			response.choices[0].message?.content ||
			"I'm sorry, I couldn't generate a response at this time.";

		if (response.choices[0].message?.tool_calls) {
			// The model wants to call a function
			const tool_calls = response.choices[0].message.tool_calls;
			const functionResult = await executeFunction(tool_calls);

			messages.push(response.choices[0].message as ChatMessage);
			// Add the function result to the messages
			messages.push({
				role: "tool",
				tool_call_id: tool_calls[0].id,
				content: JSON.stringify(functionResult),
			});

			// Make a follow-up request to the API with the function result
			const secondResponse = await openai.chat.completions.create({
				model: config.openaiModel,
				messages: messages,
				max_tokens: botConfig.maxTokens,
				temperature,
			});

			result =
				secondResponse.choices[0].message?.content ||
				"I processed your request but couldn't generate a final response.";
		}
		return result;
	} catch (error) {
		console.error("Error communicating with AI service:", error);
		return "I'm experiencing technical difficulties. Please try again later.";
	}
}
