import "../single/single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import EditIcon from "@mui/icons-material/Edit";

const RoomSingle = () => {
  const { id } = useParams();

  // Fetch room
  const { data, loading, error } = useFetch(`/api/rooms/${id}`);

  // Fetch hotel name when room hotelId becomes available
  const { data: hotelData } = useFetch(
    data?.hotelId ? `/api/hotels/find/${data.hotelId}` : null
  );

  if (loading) {
    return (
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading room details...</p>
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
            <p>Unable to fetch room information. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Hide internal fields
  const hiddenKeys = ["_id", "__v", "updatedAt"];

  // Format display name
  const formatKey = (key) => {
    if (key === "roomNumbers") return "Room Numbers";
    if (key === "hotelId") return "Hotel";

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Custom value formatting
  const formatValue = (value, key) => {
    if (value === null || value === undefined) return "N/A";

    // Show hotel name instead of ID
    if (key === "hotelId") {
      return hotelData?.name || "Loading...";
    }

    // Format roomNumbers array
    if (key === "roomNumbers") {
      return value.map((room) => room.number).join(", ");
    }

    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();

    if (typeof value === "object") return JSON.stringify(value, null, 2);

    return value.toString();
  };

  const displayTitle = data.title || "Room Details";

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
                <span className="breadcrumbItem">rooms</span>
                <span className="breadcrumbSeparator">/</span>
                <span className="breadcrumbItem active">{displayTitle}</span>
              </div>
              <h1 className="pageTitle">{displayTitle}</h1>
              <p className="pageSubtitle">View and manage room information</p>
            </div>
            <Link to={`/rooms/edit/${id}`} style={{ textDecoration: "none" }}>
              <button className="editButton">
                <EditIcon />
                <span>Edit</span>
              </button>
            </Link>
          </div>

          {/* Main Card */}
          <div className="detailsCard">
            <div className="cardBody">
              <div className="infoGrid">
                {Object.entries(data)
                  .filter(([key]) => !hiddenKeys.includes(key))
                  .map(([key, value]) => (
                    <div className="infoItem" key={key}>
                      <div className="infoLabel">{formatKey(key)}</div>
                      <div className="infoValue">{formatValue(value, key)}</div>
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

export default RoomSingle;
