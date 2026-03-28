import express from "express";
import { submitInquiry } from "../controllers/inquiry.controller";

const router = express.Router();

router.post("/submit", submitInquiry);

export default router;