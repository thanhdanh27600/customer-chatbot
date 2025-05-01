export const isProduction = process.env.NODE_ENV === "production";
export const BASE_URL = isProduction
	? "http://localhost:3333" // todo
	: "http://localhost:3333";
