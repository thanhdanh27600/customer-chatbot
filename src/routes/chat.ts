import {Router} from "express";
import {chatController} from "../controllers/chat.controller";
import {orgMiddleware} from "../middleware/org.middleware";

const router = Router();

router.post("/search", orgMiddleware.authenticate, chatController.findChat);
router.post(
	"/open-channel",
	orgMiddleware.authenticate,
	chatController.openChannel
);
router.post(
	"/send-message",
	orgMiddleware.authenticate,
	chatController.sendMessage
);
router.post(
	"/messages",
	orgMiddleware.authenticate,
	chatController.findMessages
);

export default router;
