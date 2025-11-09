import express from "express";
import {
  getRecommendations,
  getSimilarUsers,
} from "../controllers/recommendation.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// GET personalized recommendations for a user
router.get("/:userId", verifyToken, getRecommendations);

// GET similar users (for debugging/analytics)
router.get("/:userId/similar", verifyToken, getSimilarUsers);

export default router;
