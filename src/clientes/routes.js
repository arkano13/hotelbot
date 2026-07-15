import { Router } from "express";
import {
  guardarCliente,
  consultarCliente,
} from "./controller.js";

const router = Router();

router.post("/", guardarCliente);
router.get("/:telefono", consultarCliente);

export default router;