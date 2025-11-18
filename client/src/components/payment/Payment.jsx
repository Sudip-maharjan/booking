import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./payment.css";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ bookingId, totalPrice, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          redirect: "if_required",
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm payment with backend
        await axios.post("/api/payment/confirm-payment", {
          paymentIntentId: paymentIntent.id,
          bookingId,
        });

        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <h2>Complete Payment</h2>
        <p className="payment-amount">
          Total: Rs.{totalPrice} -{/* || ${(totalPrice / 140).toFixed(2)} */}
        </p>
      </div>

      <PaymentElement />

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-buttons">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-pay" disabled={!stripe || loading}>
          {loading ? "Processing..." : `Pay Rs.${totalPrice}`}
        </button>
      </div>
    </form>
  );
};

// Main Payment Component
const Payment = ({ bookingId, totalPrice, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post("/api/payment/create-payment-intent", {
          bookingId,
        });
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to initialize payment");
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error-container">
        <p>{error}</p>
        <button onClick={onCancel}>Go Back</button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="payment-container">
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          bookingId={bookingId}
          totalPrice={totalPrice}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
};

export default Payment;
