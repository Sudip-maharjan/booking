import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Payment from "../payment/Payment";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "payAtHotel"

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

      const calculatedPrice = calculateTotalPrice();

      // Create booking based on payment method
      const bookingData = {
        user: user._id,
        hotel: hotelId,
        room: roomDetails,
        checkInDate: dates[0].startDate,
        checkOutDate: dates[0].endDate,
        totalPrice: calculatedPrice,
        guests: options.adult + options.children || 1,
        paymentMethod:
          paymentMethod === "card" ? "Credit Card" : "Pay At Hotel",
        status: paymentMethod === "card" ? "pending" : "confirmed",
        isPaid: false,
      };

      const response = await axios.post("/api/bookings", bookingData);

      // Update room availability
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/api/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );

      // If paying by card, show payment modal
      if (paymentMethod === "card") {
        setBookingId(response.data._id);
        setTotalPrice(calculatedPrice);
        setShowPayment(true);
      } else {
        // If paying at hotel, booking is confirmed immediately
        alert("Booking successful! You can pay at the hotel.");
        setOpen(false);
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    alert("Payment successful! Your booking is confirmed.");
    setOpen(false);
    setShowPayment(false);
    navigate("/my-bookings");
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    // Optionally cancel the booking if payment is not completed
    if (bookingId) {
      axios
        .put(`/api/bookings/${bookingId}/cancel`)
        .then(() => {
          alert("Booking cancelled. Please try again.");
        })
        .catch((err) => console.error(err));
    }
  };

  // If payment modal is shown, display it
  if (showPayment) {
    return (
      <div className="reserve">
        <div className="rContainer">
          <Payment
            bookingId={bookingId}
            totalPrice={totalPrice}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    );
  }

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

        {/* Payment Method Selection */}
        {selectedRooms.length > 0 && (
          <div className="rPaymentMethod">
            <span className="rPaymentTitle">Payment Method:</span>
            <div className="rPaymentOptions">
              <label className="rPaymentOption">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay with Card (Online Payment)</span>
              </label>
              <label className="rPaymentOption">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payAtHotel"
                  checked={paymentMethod === "payAtHotel"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay at Hotel</span>
              </label>
            </div>
          </div>
        )}

        <button onClick={handleClick} className="rButton">
          {paymentMethod === "card" ? "Proceed to Payment" : "Reserve Now!"}
        </button>
      </div>
    </div>
  );
};

export default Reserve;
