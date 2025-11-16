import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false); // Prevent multiple verification attempts

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple verification attempts
      if (hasVerified.current) {
        return;
      }
      hasVerified.current = true;

      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(response.data.message);

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    if (token && !hasVerified.current) {
      verifyEmail();
    } else if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token, navigate]);

  return (
    <div className="verifyEmail">
      <div className="veContainer">
        {status === "verifying" && (
          <div className="veVerifying">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="veSuccess">
            <div className="veIcon success">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>{message}</p>
            <p className="veRedirect">Redirecting to login page...</p>
            <Link to="/login" className="veButton">
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="veError">
            <div className="veIcon error">✕</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="veActions">
              <Link to="/resend-verification" className="veButton">
                Resend Verification Email
              </Link>
              <Link to="/register" className="veButton secondary">
                Register Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
