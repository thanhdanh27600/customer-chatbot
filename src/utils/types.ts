export interface ServiceDescription {
	id: string;
	name: string;
	description: string;
	features: string[];
	commonIssues?: string[];
	pricing?: string;
}

export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface BotConfig {
	systemPrompt: string;
	maxTokens: number;
	temperature: number;
	serviceSummaryPrompt: string;
}
