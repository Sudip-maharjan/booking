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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    // Check empty fields
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return "Please enter a valid email address";
    }

    // Validate password length
    if (credentials.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    // Validate phone (basic check for numbers)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(credentials.phone)) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/register", credentials);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);

      // Handle specific error cases
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
        {success && (
          <span className="rSuccess">
            Registration successful! Redirecting to login...
          </span>
        )}

        <div className="rFooter">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
