import * as fs from "fs";
import OpenAI from "openai";
import {config} from "../../config";
import {BotConfig, ChatMessage, ServiceDescription} from "../../types";
import {
	detectScenarioType,
	getEnhancedSystemPrompt,
	getTemperatureForScenario,
} from "./optimized-prompts";

const openai = new OpenAI({
	baseURL: config.openaiBaseUrl,
	apiKey: config.openaiApiKey,
});

export const botConfig: BotConfig = {
	systemPrompt: `You are a helpful customer support agent for our company. 
Your goal is to provide clear, concise, and accurate information about our services and help customers with their issues.

When responding to customers:
1. Be friendly, professional, and empathetic
2. Answer questions based on the service information provided
3. If you don't know the answer, acknowledge that and offer to escalate to a human agent
4. For technical issues, provide step-by-step troubleshooting when possible
5. Suggest relevant related services when appropriate, but don't be pushy
6. Keep responses concise but complete

Remember, your goal is to resolve the customer's issue efficiently while providing a positive experience.`,
	maxTokens: 500,
	temperature: 0.7,
	serviceSummaryPrompt:
		"Here's a summary of all our services that you can use to answer customer questions:",
};

// Read service descriptions from file
export function loadServiceDescriptions(
	filePath: string
): ServiceDescription[] {
	try {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error loading service descriptions:", error);
		return [];
	}
}

// Prepare services information for the AI context
export function prepareServicesContext(services: ServiceDescription[]): string {
	let context = botConfig.serviceSummaryPrompt + "\n\n";

	services.forEach((service) => {
		context += `SERVICE: ${service.name}\n`;
		context += `DESCRIPTION: ${service.description}\n`;

		context += "FEATURES:\n";
		service.features.forEach((feature) => {
			context += `- ${feature}\n`;
		});

		if (service.commonIssues && service.commonIssues.length > 0) {
			context += "COMMON ISSUES AND SOLUTIONS:\n";
			service.commonIssues.forEach((issue) => {
				context += `- ${issue}\n`;
			});
		}

		if (service.pricing) {
			context += `PRICING: ${service.pricing}\n`;
		}

		context += "\n";
	});

	return context;
}

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

		// Add the enhanced system prompt
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
		});

		return (
			response.choices[0].message?.content ||
			"I'm sorry, I couldn't generate a response at this time."
		);
	} catch (error) {
		console.error("Error communicating with AI service:", error);
		return "I'm experiencing technical difficulties. Please try again later.";
	}
}
