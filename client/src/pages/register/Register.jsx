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
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !credentials.username ||
      !credentials.email ||
      !credentials.password ||
      !credentials.phone ||
      !credentials.city ||
      !credentials.country
    ) {
      setError({ message: "Please fill in all fields" });
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/register", credentials);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || { message: "Registration failed" });
      setLoading(false);
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
        />

        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="rInput"
          value={credentials.email}
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="rInput"
          value={credentials.password}
        />

        <input
          type="text"
          placeholder="Phone"
          id="phone"
          onChange={handleChange}
          className="rInput"
          value={credentials.phone}
        />

        <input
          type="text"
          placeholder="City"
          id="city"
          onChange={handleChange}
          className="rInput"
          value={credentials.city}
        />

        <input
          type="text"
          placeholder="Country"
          id="country"
          onChange={handleChange}
          className="rInput"
          value={credentials.country}
        />

        <button disabled={loading} onClick={handleClick} className="rButton">
          {loading ? "Creating account..." : "Register"}
        </button>

        {error && <span className="rError">{error.message}</span>}
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
