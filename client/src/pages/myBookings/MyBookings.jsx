import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { format } from "date-fns";
import "./MyBookings.css";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/bookings/user/${user._id}`);
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);

      // Update the booking status in the local state
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="myBookingsContainer">
          <h1>Please login to view your bookings</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="myBookingsContainer">
        <h1 className="myBookingsTitle">My Bookings</h1>

        {loading ? (
          <div className="loadingText">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="noBookings">
            <h2>No bookings found</h2>
            <p>Start exploring and book your next adventure!</p>
          </div>
        ) : (
          <div className="bookingsList">
            {bookings.map((booking) => (
              <div className="bookingCard" key={booking._id}>
                <div className="bookingHeader">
                  <div className="hotelInfo">
                    {booking.hotel?.photos?.[0] && (
                      <img
                        src={booking.hotel.photos[0]}
                        alt={booking.hotel.name}
                        className="bookingImage"
                      />
                    )}
                    <div>
                      <h2>{booking.hotel?.name || "Hotel"}</h2>
                      <p className="hotelLocation">
                        {booking.hotel?.city}, {booking.hotel?.address}
                      </p>
                    </div>
                  </div>
                  <div
                    className="bookingStatus"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.toUpperCase()}
                  </div>
                </div>

                <div className="bookingDetails">
                  <div className="detailItem">
                    <span className="detailLabel">Check-in:</span>
                    <span className="detailValue">
                      {format(new Date(booking.checkInDate), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="detailLabel">Check-out:</span>
                    <span className="detailValue">
                      {format(new Date(booking.checkOutDate), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="detailLabel">Guests:</span>
                    <span className="detailValue">{booking.guests}</span>
                  </div>
                  <div className="detailItem">
                    <span className="detailLabel">Rooms:</span>
                    <span className="detailValue">
                      {booking.room?.map((r) => r.roomNumber).join(", ")}
                    </span>
                  </div>
                </div>

                <div className="bookingFooter">
                  <div className="paymentInfo">
                    <span className="paymentMethod">
                      {booking.paymentMethod}
                    </span>
                    <span
                      className={`paymentStatus ${
                        booking.isPaid ? "paid" : "unpaid"
                      }`}
                    >
                      {booking.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="totalPrice">
                    <span>Total:</span>
                    <span className="price">${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="bookingDate">
                  Booked on{" "}
                  {format(new Date(booking.createdAt), "dd MMM yyyy, HH:mm")}
                </div>

                {/* Cancel Button - Only show for non-cancelled bookings */}
                {booking.status !== "cancelled" && (
                  <button
                    className="cancelButton"
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={cancellingId === booking._id}
                  >
                    {cancellingId === booking._id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
