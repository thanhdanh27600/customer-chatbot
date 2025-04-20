import dotenv from "dotenv";
import {BotConfig} from "./types";

dotenv.config();

export const config = {
	port: process.env.PORT,
	openaiApiKey: process.env.OPENAI_API_KEY,
	openaiModel: process.env.OPENAI_MODEL as string,
	openaiBaseUrl: process.env.OPENAI_BASE_URL,
};

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
