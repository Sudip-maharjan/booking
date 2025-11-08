import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useParams, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Single = () => {
  const { id } = useParams();
  const location = useLocation();
  const path = location.pathname.split("/")[1]; // users / hotels / rooms

  // ✅ Fix: Dynamic API endpoint for hotels
  const apiEndpoint =
    path === "hotels"
      ? `/api/${path}/find/${id}` // hotel route uses /find/:id
      : `/api/${path}/${id}`;

  // Fetch data
  const { data, loading, error } = useFetch(apiEndpoint);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading {path} data</div>;

  // Dynamic image fallback for users & hotels
  const imageSrc =
    data.img ||
    data.photos?.[0] ||
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg";

  // Keys to hide from the list
  const hiddenKeys = ["_id", "__v", "img", "password", "photos", "updatedAt"];

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">
              {path.slice(0, -1).toUpperCase()} Information
            </h1>

            <div className="item">
              <img src={imageSrc} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">
                  {data.username || data.name || data.title || "Details"}
                </h1>

                {Object.entries(data)
                  .filter(([key]) => !hiddenKeys.includes(key))
                  .map(([key, value]) => (
                    <div className="detailItem" key={key}>
                      <span className="itemKey">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <span className="itemValue">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value?.toString() ?? "N/A"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="right">
            <Chart aspect={3 / 1} title="Activity (Last 6 Months)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
