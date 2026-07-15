import { Router } from "express";

import {
  listarTarifas,
  consultarTarifa,
} from "./controller.js";

const router = Router();

router.get("/", listarTarifas);
router.get("/:personas", consultarTarifa);

export default router;