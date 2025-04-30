import {Response} from "express";
import {openChatChannel, searchGuestChat} from "../services/chat.service";
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

export const chatController = {
	findChat,
	openChannel,
};
