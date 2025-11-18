import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  createRefund,
} from "../controllers/payment.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create payment intent
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

// Confirm payment
router.post("/confirm-payment", verifyToken, confirmPayment);

// Stripe webhook (no auth needed - Stripe will send signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Create refund (admin only)
router.post("/refund", verifyAdmin, createRefund);

export default router;
