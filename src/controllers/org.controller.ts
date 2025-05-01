import {Response} from "express";
import {getOrg} from "../services/org.service";
import {RequestWithOrg} from "../types/request";
import {notFound, successRequest} from "../utils/error";

const findOrgCL = async (request: RequestWithOrg, response: Response) => {
	const orgId = request.params.id as string;
	try {
		const org = await getOrg(orgId);
		return successRequest(response, org);
	} catch (error) {
		return notFound(response);
	}
};

export const orgController = {
	findOrgCL,
};
