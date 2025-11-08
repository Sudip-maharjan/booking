import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import EditIcon from "@mui/icons-material/Edit";

const Single = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/api/users/${id}`);

  if (loading) {
    return (
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="errorState">
            <div className="errorIcon">⚠️</div>
            <h2>Error Loading Data</h2>
            <p>Unable to fetch user information. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const hiddenKeys = ["_id", "__v", "password", "updatedAt", "img"];

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") {
      if (Array.isArray(value)) return value.join(", ");
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === "number") return value.toLocaleString();
    return value.toString();
  };

  const imageSrc = data.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif";
  const displayTitle = data.username || "User Details";

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        <div className="contentWrapper">
          {/* Header Section */}
          <div className="pageHeader">
            <div className="headerContent">
              <div className="breadcrumb">
                <span className="breadcrumbItem">users</span>
                <span className="breadcrumbSeparator">/</span>
                <span className="breadcrumbItem active">{displayTitle}</span>
              </div>
              <h1 className="pageTitle">{displayTitle}</h1>
              <p className="pageSubtitle">View and manage user information</p>
            </div>
            <Link to={`/users/edit/${id}`} style={{ textDecoration: "none" }}>
              <button className="editButton">
                <EditIcon />
                <span>Edit</span>
              </button>
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="detailsCard">
            <div className="cardHeader">
              <div className="imageWrapper">
                <img
                  src={imageSrc}
                  alt={displayTitle}
                  className="entityImage"
                />
                <div className="imageOverlay">
                  <span className="entityBadge">user</span>
                </div>
              </div>
            </div>

            <div className="cardBody">
              <div className="infoGrid">
                {Object.entries(data)
                  .filter(([key]) => !hiddenKeys.includes(key))
                  .map(([key, value]) => (
                    <div className="infoItem" key={key}>
                      <div className="infoLabel">{formatKey(key)}</div>
                      <div className="infoValue">{formatValue(value)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
