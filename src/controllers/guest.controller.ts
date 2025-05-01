import {Response} from "express";
import {createGuest, getGuest} from "../services/guest.service";
import {RequestWithOrg} from "../types/request";
import {badRequest, notFound, successRequest} from "../utils/error";

const findGuestCL = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {guestId: string};
	try {
		const guest = await getGuest(body.guestId);
		return successRequest(response, guest);
	} catch (error) {
		return notFound(response);
	}
};

const createGuestCL = async (request: RequestWithOrg, response: Response) => {
	const body = request.body as {
		ipInfo: any;
	};
	const {ipInfo} = body;
	try {
		const guest = await createGuest({ipInfo});
		return successRequest(response, guest);
	} catch (error) {
		return badRequest(response);
	}
};

export const guestController = {
	findGuestCL,
	createGuestCL,
};
