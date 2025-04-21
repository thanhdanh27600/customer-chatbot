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
	summaryPrompt?: string;
}

export interface FunctionParameter {
	type: string;
	description?: string;
	enum?: string[];
	items?: {
		type: string;
	};
}

export interface FunctionDefinition {
	name: string;
	description: string;
	parameters: {
		type: string;
		properties: Record<string, FunctionParameter>;
		required?: string[];
	};
}

export interface FunctionCall {
	name: string;
	arguments: string;
}

export interface FunctionResult {
	[key: string]: any;
	error?: string;
}

export type FunctionHandler = (args: any) => Promise<FunctionResult>;
