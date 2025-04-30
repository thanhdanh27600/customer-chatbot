import {RecordModel} from "pocketbase";

export enum UserRole {
	CLIENT = "client",
	AI_BOT = "ai_bot",
	CUSTOMER_SERVICE = "customer_service",
}

export interface Message extends Partial<RecordModel> {
	id: string;
	body: string;
	role: UserRole;
	timestamp: number;
	status?: "sending" | "sent" | "failed";
	metadata?: Record<string, any>;
}

export interface CreateMessageDTO {
	content: string;
	role: UserRole;
}

export enum ChatStatus {
	open = "open",
	paused = "paused",
	closed = "closed",
}
export interface Chat extends Partial<RecordModel> {
	id: string;
	status: ChatStatus;
	messages: Message[];
	created: string;
	updated: string;
}

export interface BotChatRequest {
	platform_id: string;
	phone_number: string;
	platform: string;
	message: string;
}
