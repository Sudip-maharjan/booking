import "./HotelSingle.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";

// MUI Icons
import HotelIcon from "@mui/icons-material/Hotel";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const HotelSingle = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data, loading, error } = useFetch(`/api/hotels/find/${id}`);

  if (loading) {
    return (
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading hotel details...</p>
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
            <WarningAmberIcon style={{ fontSize: 64, color: "#dc3545" }} />
            <h2>Error Loading Data</h2>
            <p>Unable to fetch hotel information. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const images =
    data.photos && data.photos.length > 0
      ? data.photos
      : ["https://i.ibb.co/MBtjqXQ/no-avatar.gif"];
  const imageSrc = images[currentImageIndex];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const hiddenKeys = ["_id", "__v", "photos", "updatedAt"];

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

  const displayTitle = data.name || "Hotel Details";

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
                <span className="breadcrumbItem">hotels</span>
                <span className="breadcrumbSeparator">/</span>
                <span className="breadcrumbItem active">{displayTitle}</span>
              </div>
              <h1 className="pageTitle">{displayTitle}</h1>
              <p className="pageSubtitle">View and manage hotel information</p>
            </div>
            <Link to={`/hotels/edit/${id}`} style={{ textDecoration: "none" }}>
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
                  <span className="entityBadge">hotel</span>
                  {images.length > 1 && (
                    <span className="imageCounter">
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  )}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      className="imageNavButton prev"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className="imageNavButton next"
                      onClick={handleNextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    <div className="thumbnailStrip">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          className={`thumbnail ${
                            currentImageIndex === idx ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(idx)}
                          alt={`thumbnail-${idx}`}
                        />
                      ))}
                    </div>
                  </>
                )}
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

          {/* Stats Cards */}
          <div className="statsGrid">
            <div className="statCard">
              <div className="statIcon">
                <HotelIcon fontSize="large" />
              </div>
              <div className="statContent">
                <div className="statLabel">Type</div>
                <div className="statValue">{data.type || "N/A"}</div>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <StarIcon fontSize="large" />
              </div>
              <div className="statContent">
                <div className="statLabel">Rating</div>
                <div className="statValue">{data.rating || "N/A"}</div>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <LocationOnIcon fontSize="large" />
              </div>
              <div className="statContent">
                <div className="statLabel">City</div>
                <div className="statValue">{data.city || "N/A"}</div>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <AttachMoneyIcon fontSize="large" />
              </div>
              <div className="statContent">
                <div className="statLabel">Cheapest Price</div>
                <div className="statValue">
                  Rs.{data.cheapestPrice?.toLocaleString() || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSingle;
