import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const firstLetter = user?.username ? user.username.charAt(0) : "?";
  const handleButton = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className="outer-box">
      <div className="profile-container">
        <div className="info">
          <div className="avatar">
            {user?.profilepic ? (
              <img
                src={user.profilepic}
                alt={user.username}
              />
            ) : (
              <div className="letter-frame">
                <p className="letter">{firstLetter}</p>
              </div>
            )}
            {/* <p>{user.username}</p> */}
          </div>
          <div className="user-details">
            <p>{user.username}</p>
            <p>{user.email}</p>
            <p>{user.phone || 987555881}</p>
            <p>{user.country || "nepal"}</p>
            <p>{user.city || "ktm"}</p>
          </div>
        </div>
        <div className="action">
          <div>
            <button onClick={handleButton}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
