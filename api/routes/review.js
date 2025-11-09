import express from "express";
import { addReview } from "../controllers/review.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/:id/review", verifyToken, addReview);

export default router;
