import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/api/hotels/room/${hotelId}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const calculateTotalPrice = () => {
    let total = 0;
    selectedRooms.forEach((roomId) => {
      data.forEach((item) => {
        const roomNumber = item.roomNumbers.find((rn) => rn._id === roomId);
        if (roomNumber) {
          total += item.price * alldates.length;
        }
      });
    });
    return total;
  };

  const handleClick = async () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room");
      return;
    }

    try {
      // Prepare room details for booking
      const roomDetails = [];
      selectedRooms.forEach((roomId) => {
        data.forEach((item) => {
          const roomNumber = item.roomNumbers.find((rn) => rn._id === roomId);
          if (roomNumber) {
            roomDetails.push({
              roomId: item._id,
              roomNumber: roomNumber.number,
            });
          }
        });
      });

      // Create booking
      const bookingData = {
        user: user._id,
        hotel: hotelId,
        room: roomDetails,
        checkInDate: dates[0].startDate,
        checkOutDate: dates[0].endDate,
        totalPrice: calculateTotalPrice(),
        guests: options.adult + options.children || 1,
        paymentMethod: "Pay At Hotel",
        status: "confirmed",
        isPaid: false,
      };

      await axios.post("/api/bookings", bookingData);

      // Update room availability
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/api/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );

      alert("Booking successful!");
      setOpen(false);
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">Rs.{item.price} per night</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {selectedRooms.length > 0 && (
          <div className="rTotal">
            <span>Total Price: Rs.{calculateTotalPrice()}</span>
            <span className="rNights">({alldates.length} nights)</span>
          </div>
        )}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
