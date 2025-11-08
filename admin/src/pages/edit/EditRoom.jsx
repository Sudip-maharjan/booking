import "./EditRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, loading: fetchLoading } = useFetch(`/api/rooms/${id}`);
  const { data: hotels } = useFetch("/api/hotels");

  useEffect(() => {
    if (data) {
      setInfo(data);
      setHotelId(data.hotelId || "");

      // Parse roomNumbers if it's a string
      if (data.roomNumbers) {
        const roomNums =
          typeof data.roomNumbers === "string"
            ? data.roomNumbers.split(",").map((num) => ({
                number: parseInt(num.trim()),
                unavailableDates: [],
              }))
            : data.roomNumbers;
        setRooms(roomNums);
      }
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!info.title || !info.price || !info.maxPeople) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!hotelId) {
      alert("Please select a hotel");
      setLoading(false);
      return;
    }

    if (rooms.length === 0) {
      alert("Please add at least one room number");
      setLoading(false);
      return;
    }

    try {
      const roomData = {
        ...info,
        roomNumbers: rooms,
      };

      // If hotel changed, we need to handle the update differently
      const oldHotelId = data.hotelId;

      await axios.put(`/api/rooms/${id}`, roomData);

      // If hotel changed, update both hotels
      if (oldHotelId && oldHotelId !== hotelId) {
        // Remove room from old hotel
        await axios.put(`/api/hotels/${oldHotelId}`, {
          $pull: { rooms: id },
        });

        // Add room to new hotel
        await axios.put(`/api/hotels/${hotelId}`, {
          $push: { rooms: id },
        });
      } else if (!oldHotelId && hotelId) {
        // If there was no hotel before, add to new hotel
        await axios.put(`/api/hotels/${hotelId}`, {
          $push: { rooms: id },
        });
      }

      navigate("/rooms");
    } catch (err) {
      console.log(err);
      alert(
        "Error updating room: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoomNumberChange = (index, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      number: parseInt(value) || 0,
    };
    setRooms(updatedRooms);
  };

  const addRoomNumber = () => {
    setRooms([...rooms, { number: 0, unavailableDates: [] }]);
  };

  const removeRoomNumber = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  if (fetchLoading) {
    return (
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="loading">Loading room data...</div>
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
          <h1>Edit Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    value={info[input.id] || ""}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                  value={hotelId}
                >
                  <option value="">Select Hotel</option>
                  {hotels &&
                    hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="formInput">
                <label>Room Numbers</label>
                <div className="roomNumbersContainer">
                  {rooms.map((room, index) => (
                    <div key={index} className="roomNumberItem">
                      <input
                        type="number"
                        placeholder="Room number"
                        value={room.number || ""}
                        onChange={(e) =>
                          handleRoomNumberChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeRoomNumber(index)}
                        className="removeButton"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRoomNumber}
                    className="addButton"
                  >
                    + Add Room Number
                  </button>
                </div>
              </div>

              <button
                onClick={handleClick}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
                type="submit"
              >
                {loading ? "Updating..." : "Update Room"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
