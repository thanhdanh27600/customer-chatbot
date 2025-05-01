import {Router} from "express";
import {guestController} from "../controllers/guest.controller";

const router = Router();

router.post("/search", guestController.findGuestCL);
router.post("/create", guestController.createGuestCL);

export default router;
