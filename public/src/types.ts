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
	status?: "sending" | "sent" | "failed";
}
export interface ChatWidgetConfig {
	orgId?: string;
	companyName?: string;
	initialMessage?: string;
	primaryColor?: string;
	secondaryColor?: string;
	borderRadius?: string;
	isFullHeight?: boolean;
}

export interface ChatWidgetState {
	isOpen: boolean;
	loading: boolean;
	messages: Message[];
	lastMessageLoading: string;
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
