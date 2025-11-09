import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Navbar = () => {
  const { user } = useContext(AuthContext);

  const firstLetter = user?.username ? user.username.charAt(0) : "?";

  // const handleButton = () => {
  //   dispatch({ type: "LOGOUT" });
  //   localStorage.removeItem("user");
  //   navigate("/");
  // };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link
          to="/"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <span className="logo">Booking</span>
        </Link>
        {user ? (
          <Link
            className="letter-link"
            to={`/profile/${user.username}`}
          >
            <div className="avatar">
              <p>{firstLetter}</p>
            </div>
          </Link>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
