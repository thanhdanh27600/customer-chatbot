import {NextFunction, Response} from "express";
import {pb} from "../pocketbase";
import {RequestWithOrg} from "../types/request";
import {HEADER} from "../utils/config";
import {unauthorizedRequest} from "../utils/error";

const authenticate = async (
	req: RequestWithOrg,
	res: Response,
	next: NextFunction
) => {
	// Handle preflight OPTIONS requests
	if (req.method === "OPTIONS") {
		return next();
	}

	const id = req.headers[HEADER.orgId] as string;
	if (!id) {
		return unauthorizedRequest(res);
	}

	try {
		const org = await pb.collection("orgs").getOne(id);
		req.org = org;
		return next();
	} catch (error) {
		console.error("Authentication error:", error);
		return unauthorizedRequest(res);
	}
};
export const orgMiddleware = {authenticate};
