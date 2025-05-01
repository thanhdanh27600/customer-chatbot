import {Router} from "express";
import {orgController} from "../controllers/org.controller";

const router = Router();

router.get("/:id", orgController.findOrgCL);

export default router;
