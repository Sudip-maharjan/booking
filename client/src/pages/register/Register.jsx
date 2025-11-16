import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (
      !credentials.username ||
      !credentials.email ||
      !credentials.password ||
      !credentials.phone ||
      !credentials.city ||
      !credentials.country
    ) {
      return "Please fill in all fields";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return "Please enter a valid email address";
    }

    if (credentials.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(credentials.phone)) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", credentials);
      setSuccess(true);
      setRegisteredEmail(credentials.email);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const errorMessage = err.response?.data?.message || err.message;

      if (
        errorMessage.includes("E11000") ||
        errorMessage.includes("duplicate")
      ) {
        if (errorMessage.includes("email")) {
          setError("This email is already registered");
        } else if (errorMessage.includes("username")) {
          setError("This username is already taken");
        } else {
          setError("An account with these details already exists");
        }
      } else if (err.response?.status === 400) {
        setError("Invalid registration details");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later");
      } else {
        setError("Registration failed. Please try again");
      }
    }
  };

  if (success) {
    return (
      <div className="register">
        <div className="rContainer">
          <div className="rSuccessMessage">
            <div className="rSuccessIcon">✓</div>
            <h2>Registration Successful!</h2>
            <p>
              We've sent a verification email to{" "}
              <strong>{registeredEmail}</strong>
            </p>
            <p className="rVerifyInstructions">
              Please check your email and click the verification link to
              activate your account.
            </p>
            <div className="rSuccessActions">
              <Link to="/login" className="rButton">
                Go to Login
              </Link>
              <Link to="/resend-verification" className="rLinkButton">
                Didn't receive email?
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register">
      <div className="rContainer">
        <h2 className="rTitle">Create Account</h2>

        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={handleChange}
          className="rInput"
          value={credentials.username}
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="rInput"
          value={credentials.email}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          id="password"
          onChange={handleChange}
          className="rInput"
          value={credentials.password}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Phone"
          id="phone"
          onChange={handleChange}
          className="rInput"
          value={credentials.phone}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="City"
          id="city"
          onChange={handleChange}
          className="rInput"
          value={credentials.city}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Country"
          id="country"
          onChange={handleChange}
          className="rInput"
          value={credentials.country}
          disabled={loading}
        />

        <button disabled={loading} onClick={handleClick} className="rButton">
          {loading ? "Creating account..." : "Register"}
        </button>

        {error && <span className="rError">{error}</span>}

        <div className="rFooter">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
