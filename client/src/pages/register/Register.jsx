import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { sign_up } from "../../constants/dataFetch";
import { LOGIN_FAILURE, LOGIN_SUCCESS } from "../../constants/actionTypes";
const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
    city: undefined,
    country: undefined,
    phone: undefined,
  });
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const { data } = await sign_up(credentials);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      navigate("/login");
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.response.data });
    }
  };
  return (
    <form onSubmit={handleClick}>
      <div className="login">
        <div className="lContainer">
          <input
            type="text"
            placeholder="username"
            id="username"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="number"
            placeholder="phone"
            id="phone"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="text"
            placeholder="country"
            id="country"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="text"
            placeholder="city"
            id="city"
            onChange={handleChange}
            className="lInput"
          />

          <button
            disabled={loading}
            className="lButton"
          >
            Register
          </button>
          {error && <span>{error.message}</span>}
        </div>
      </div>
    </form>
  );
};

export default Register;
