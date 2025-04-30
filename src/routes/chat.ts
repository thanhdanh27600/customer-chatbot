import {Router} from "express";
import {chatController} from "../controllers/chat.controller";
import {orgMiddleware} from "../middleware/org.middleware";

const router = Router();

router.post("/search", orgMiddleware.authenticate, chatController.findChat);
router.post("/open", orgMiddleware.authenticate, chatController.openChannel);

export default router;
