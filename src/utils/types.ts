import OpenAI from "openai";

export interface ServiceDescription {
	id: string;
	name: string;
	description: string;
	features: string[];
	commonIssues?: string[];
	pricing?: string;
}

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface BotConfig {
	systemPrompt: string;
	maxTokens: number;
	temperature: number;
	serviceSummaryPrompt: string;
}
