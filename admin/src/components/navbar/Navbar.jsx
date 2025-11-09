import "./navbar.scss";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const imageSrc = user.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif";
  const title = user.username;
  return (
    <div className="navbar">
      <div className="wrapper">
        <div></div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <img src={imageSrc} alt="" className="avatar" />
            <div>{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
