import { Router } from "express";
import { consultar } from "./controller.js";

const router = Router();

router.post("/", consultar);

export default router;