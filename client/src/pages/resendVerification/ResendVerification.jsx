import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ResendVerification.css";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/resend-verification", {
        email,
      });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resendVerification">
      <div className="rvContainer">
        <h2>Resend Verification Email</h2>
        <p className="rvDescription">
          Enter your email address and we'll send you a new verification link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rvInput"
            disabled={loading}
          />

          <button type="submit" className="rvButton" disabled={loading}>
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </form>

        {error && <div className="rvError">{error}</div>}
        {message && <div className="rvSuccess">{message}</div>}

        <div className="rvFooter">
          <Link to="/login">Back to Login</Link>
          <span> | </span>
          <Link to="/register">Create New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
