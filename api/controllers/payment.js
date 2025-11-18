import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { createError } from "../utils/error.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent for booking
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate("user", "email username")
      .populate("hotel", "name");

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    // Check if user owns the booking
    if (booking.user._id.toString() !== req.user.id) {
      return next(createError(403, "Unauthorized"));
    }

    // Check if already paid
    if (booking.isPaid) {
      return next(createError(400, "Booking is already paid"));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
        userId: booking.user._id.toString(),
        hotelName: booking.hotel.name,
      },
      description: `Booking for ${booking.hotel.name}`,
      receipt_email: booking.user.email,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
};

// Confirm payment and update booking
export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return next(createError(400, "Payment not completed"));
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        isPaid: true,
        paymentMethod: "Credit Card",
        status: "confirmed",
      },
      { new: true }
    ).populate("hotel", "name city address");

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    res.status(200).json({
      message: "Payment successful",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        status: "confirmed",
        paymentMethod: "Credit Card",
      });
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Create refund
export const createRefund = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    if (!booking.isPaid) {
      return next(createError(400, "Booking is not paid"));
    }

    if (booking.status === "cancelled") {
      return next(createError(400, "Booking is already cancelled"));
    }

    // Find the payment intent from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    });

    const paymentIntent = paymentIntents.data.find(
      (pi) => pi.metadata.bookingId === bookingId
    );

    if (!paymentIntent) {
      return next(createError(404, "Payment not found"));
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntent.id,
      reason: "requested_by_customer",
    });

    // Update booking
    booking.status = "cancelled";
    booking.isPaid = false;
    await booking.save();

    res.status(200).json({
      message: "Refund processed successfully",
      refund,
      booking,
    });
  } catch (err) {
    next(err);
  }
};
