import {Request, Response, Router} from "express";
import {chat} from "../services/ai/family-tree/root";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const {input} = req.body || {};
		if (!input?.trim().length) {
			return res.status(400).json({error: "Input is required"});
		}

		// Get AI response
		const response = await chat(input);

		return res.json({
			response,
		});
	} catch (error: any) {
		console.error("Error in /family endpoint:", error);
		return res.status(500).json({
			error: error.message || "An error occurred while processing your request",
		});
	}
});

export default router;
