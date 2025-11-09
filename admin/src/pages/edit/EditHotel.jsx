import "../newHotel/newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, loading: fetchLoading } = useFetch(`/api/hotels/find/${id}`);
  const { data: roomsData } = useFetch("/api/rooms");

  useEffect(() => {
    if (data) {
      setInfo(data);
      setRooms(data.rooms || []);
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrls = info.photos || [];

      // Upload new images if any
      if (files.length > 0) {
        const list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dkrokzmvp/image/upload",
              data
            );
            return uploadRes.data.url;
          })
        );
        photoUrls = [...photoUrls, ...list];
      }

      const updatedHotel = {
        ...info,
        rooms,
        photos: photoUrls,
      };

      await axios.put(`/api/hotels/${id}`, updatedHotel);
      navigate("/hotels");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="loading">Loading hotel data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <div className="imagesPreview">
              {/* Show existing photos */}
              {info.photos && info.photos.length > 0 && (
                <div className="existingPhotos">
                  <h3>Current Photos</h3>
                  <div className="photoGrid">
                    {info.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Hotel photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show new file previews */}
              {files.length > 0 && (
                <div className="newPhotos">
                  <h3>New Photos to Add</h3>
                  <div className="photoGrid">
                    {Array.from(files).map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`New photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Add More Images:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={info[input.id] || ""}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Featured</label>
                <select
                  id="featured"
                  onChange={handleChange}
                  value={info.featured || false}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>

              <div className="selectRooms">
                <label>Rooms</label>
                <select
                  id="rooms"
                  multiple
                  onChange={handleSelect}
                  value={rooms}
                >
                  {roomsData &&
                    roomsData.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.title}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleClick}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Updating..." : "Update Hotel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
