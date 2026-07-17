import path from "path";

export const DATA_DIR = process.env.DATA_DIR || process.cwd();

export const AUTH_DIR = path.join(DATA_DIR, "auth_info_baileys");

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export const COMPROBANTES_DIR = path.join(UPLOADS_DIR, "comprobantes");