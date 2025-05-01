import {Response} from "express";
import {
	getMessages,
	openChatChannel,
	searchGuestChat,
} from "../services/chat.service";
import {RequestWithOrg} from "../types/request";
import {badRequest, notFound, successRequest} from "../utils/error";

const findChat = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {guestId: string};
	try {
		const chat = await searchGuestChat({
			orgId: request.org?.id!,
			guestId: body.guestId,
		});
		return successRequest(response, chat);
	} catch (error) {
		return notFound(response);
	}
};

const openChannel = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {
		guestId: string;
	};
	const {guestId} = body;
	try {
		const chat = await openChatChannel({guestId, orgId: request.org?.id!});
		return successRequest(response, chat);
	} catch (error) {
		return badRequest(response);
	}
};

const findMessages = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {
		chatId: string;
	};
	const {chatId} = body;
	try {
		const messages = await getMessages(chatId);
		return successRequest(response, messages);
	} catch (error) {
		return badRequest(response);
	}
};

const sendMessage = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {
		chatId: string;
		message: string;
		role: string;
	};
	const {chatId, message, role} = body;
	try {
		const messages = await getMessages(chatId);
		return successRequest(response, messages);
	} catch (error) {
		return badRequest(response);
	}
};

export const chatController = {
	findChat,
	openChannel,
	findMessages,
	sendMessage,
};
