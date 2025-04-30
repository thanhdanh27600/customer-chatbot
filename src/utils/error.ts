import {Response} from "express";

export const STANDARD = {
	CREATED: 201,
	SUCCESS: 200,
	NOCONTENT: 204,
};

export const ERROR404 = {
	statusCode: 404,
	message: "NOT_FOUND",
};

export const ERROR403 = {
	statusCode: 403,
	message: "FORBIDDEN_ACCESS",
};

export const ERROR401 = {
	statusCode: 401,
	message: "UNAUTHORIZED",
};

export const ERROR500 = {
	statusCode: 500,
	message: "TRY_AGAIN",
};

export const ERROR409 = {
	statusCode: 409,
	message: "DUPLICATE_FOUND",
};

export const ERROR400 = {
	statusCode: 400,
	message: "Bad request. Please check your input and try again.",
};

export const ERRORS = {
	postNotFound: new Error("Post not found."),
};

export const handleError = (
	res: Response,
	error: Error,
	statusCode: number = 500,
	message: string = "Internal Server Error"
) => {
	console.error(error);

	return res.status(statusCode).send({
		error: {
			message,
			statusCode,
		},
	});
};

export const badRequest = (res: Response) => {
	res.status(ERROR400.statusCode).send(ERROR400);
};

export const unauthorizedRequest = (res: Response) => {
	res.status(ERROR401.statusCode).send(ERROR401);
};

export const successRequest = (res: Response, data: any = {}) => {
	return res.status(STANDARD.SUCCESS).send(data);
};

export function notFound(response: Response) {
	response.status(ERROR404.statusCode).send(ERROR404);
}

export function handleServerError(response: Response, error?: any) {
	response.status(ERROR500.statusCode).send(error || ERROR500);
}
