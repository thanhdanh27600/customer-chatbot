import dotenv from "dotenv";

dotenv.config();

export const config = {
	port: process.env.PORT,
	openaiApiKey: process.env.OPENAI_API_KEY,
	openaiModel: process.env.OPENAI_MODEL as string,
	openaiBaseUrl: process.env.OPENAI_BASE_URL,
};
