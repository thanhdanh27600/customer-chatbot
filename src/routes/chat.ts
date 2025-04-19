import {Request, Response, Router} from "express";
import {servicesContext} from "../services/context";
import {botConfig, chat} from "../services/root";
import {ChatMessage} from "../utils/types";

const router = Router();

// Initialize a global conversation history (in a real app, you'd use a database or session storage)
// This is just for demonstration - in production, you'd store this per user/session
const conversationHistoryStore = new Map<string, ChatMessage[]>();

router.post("/", async (req: Request, res: Response) => {
	try {
		const {input, sessionId = "default"} = req.body || {};
		if (!input?.trim().length) {
			return res.status(400).json({error: "Input is required"});
		}
		// Initialize conversation history for this session if it doesn't exist
		if (!conversationHistoryStore.has(sessionId)) {
			conversationHistoryStore.set(sessionId, [
				{role: "system", content: botConfig.systemPrompt},
			]);
		}

		// Get conversation history for this session
		const conversationHistory = conversationHistoryStore.get(sessionId)!;

		// Add user message to history
		conversationHistory.push({role: "user", content: input});

		// Get AI response
		const response = await chat(
			[...conversationHistory],
			servicesContext,
			input
		);

		// Add AI response to history
		conversationHistory.push({role: "assistant", content: response});

		// Manage conversation history length (keep it within token limits)
		if (conversationHistory.length > 10) {
			// Keep system prompt and last 4 exchanges (8 messages)
			const systemPrompt = conversationHistory[0];
			conversationHistory.splice(1, conversationHistory.length - 9);
			conversationHistory.unshift(systemPrompt);
		}

		// Update the conversation history in the store
		conversationHistoryStore.set(sessionId, conversationHistory);

		return res.json({
			response,
			sessionId,
		});
	} catch (error: any) {
		console.error("Error in /chat endpoint:", error);
		return res.status(500).json({
			error: error.message || "An error occurred while processing your request",
		});
	}
});

// Add a route to clear conversation history
router.delete("/clear/:sessionId", (req: Request, res: Response) => {
	const {sessionId} = req.params;
	if (!sessionId) {
		return res.status(400).json({error: "Session ID is required"});
	}
	console.log(`Clearing history for session: ${sessionId}`);

	if (conversationHistoryStore.has(sessionId)) {
		const systemMessage = conversationHistoryStore.get(sessionId)![0];
		// Reset to just the system message
		conversationHistoryStore.set(sessionId, [systemMessage]);
		return res.json({message: "Conversation history cleared", sessionId});
	}

	return res.status(404).json({error: "Session not found"});
});

// Add a route to get conversation history
router.get("/history/:sessionId", (req: Request, res: Response) => {
	const {sessionId} = req.params;
	if (!sessionId) {
		return res.status(400).json({error: "Session ID is required"});
	}
	if (conversationHistoryStore.has(sessionId)) {
		const history = conversationHistoryStore.get(sessionId)!;
		// Exclude system message from the response
		return res.json({
			sessionId,
			history: history.slice(1),
			messageCount: history.length - 1,
		});
	}

	return res.status(404).json({error: "Session not found"});
});

export default router;
