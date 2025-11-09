import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import { Link } from "react-router-dom";

const Widget = ({ type, count }) => {
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        linkTo: "/users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "hotel":
      data = {
        title: "HOTELS",
        isMoney: false,
        link: "See all hotels",
        linkTo: "/hotels",
        icon: (
          <NightShelterOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "room":
      data = {
        title: "ROOMS",
        isMoney: false,
        link: "See all rooms",
        linkTo: "/rooms",
        icon: (
          <BedroomParentOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <Link to={data.linkTo} style={{ textDecoration: "none" }}>
          <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <span className="counter">
          {data.isMoney && "$"} {count}
        </span>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
