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
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/bookings/user/${user._id}`);
        console.log("Fetched bookings:", res.data);
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch bookings error:", err);
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

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const openRatingModal = (booking) => {
    console.log("Opening rating modal for booking:", booking);
    setRatingModal(booking);
    setRating(0);
    setHoveredRating(0);
  };

  const closeRatingModal = () => {
    setRatingModal(null);
    setRating(0);
    setHoveredRating(0);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log("Submitting rating:", {
      hotelId: ratingModal.hotel._id,
      rating,
      username: user.username,
      userId: user._id,
      bookingId: ratingModal._id,
    });

    setSubmittingRating(true);
    try {
      const response = await axios.post(
        `/api/hotels/${ratingModal.hotel._id}/review`,
        {
          rating,
          username: user.username,
          userId: user._id,
          bookingId: ratingModal._id,
        }
      );

      console.log("Rating submitted successfully:", response.data);

      // Update booking to mark as rated
      setBookings(
        bookings.map((booking) =>
          booking._id === ratingModal._id
            ? { ...booking, hasRated: true }
            : booking
        )
      );

      alert("Thank you for your review!");
      closeRatingModal();
    } catch (err) {
      console.error("Submit rating error:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const canRate = (booking) => {
    // Can rate if booking is confirmed and checkout date has passed
    const checkoutDate = new Date(booking.checkOutDate);
    const today = new Date();

    // checkoutDate < today changed for testing
    const canRateResult =
      booking.status === "confirmed" &&
      checkoutDate > today &&
      !booking.hasRated;

    // console.log("Can rate check:", {
    //   bookingId: booking._id,
    //   status: booking.status,
    //   checkoutDate: checkoutDate.toISOString(),
    //   today: today.toISOString(),
    //   hasRated: booking.hasRated,
    //   canRate: canRateResult,
    // });

    return canRateResult;
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

                <div className="bookingActions">
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

                  {canRate(booking) && (
                    <button
                      className="rateButton"
                      onClick={() => openRatingModal(booking)}
                    >
                      Rate Your Stay
                    </button>
                  )}

                  {booking.hasRated && (
                    <div className="ratedBadge">✓ Rated</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="ratingModalOverlay" onClick={closeRatingModal}>
          <div className="ratingModal" onClick={(e) => e.stopPropagation()}>
            <button className="closeModal" onClick={closeRatingModal}>
              ×
            </button>

            <h2>Rate Your Stay</h2>
            <h3>{ratingModal.hotel?.name}</h3>

            <div className="starRating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    star <= (hoveredRating || rating) ? "filled" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="ratingText">
              {rating === 0 && "Select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>

            <div className="modalActions">
              <button
                className="submitRating"
                onClick={handleSubmitRating}
                disabled={submittingRating || rating === 0}
              >
                {submittingRating ? "Submitting..." : "Submit Review"}
              </button>
              <button className="cancelRating" onClick={closeRatingModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookings;
