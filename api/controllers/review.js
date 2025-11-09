import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import { createError } from "../utils/error.js";

export const addReview = async (req, res, next) => {
  try {
    const { rating, username, userId, bookingId } = req.body;
    const hotelId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return next(createError(404, "Hotel not found"));

    // Check duplicate review
    const existingReview = hotel.userReviews.find(
      (review) => review.user.toString() === userId
    );

    if (existingReview) {
      return next(createError(400, "You have already reviewed this hotel"));
    }

    // Add new review
    hotel.userReviews.push({
      user: userId,
      username,
      rating,
    });

    // Update rating average
    const totalRating = hotel.userReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    hotel.rating = (totalRating / hotel.userReviews.length).toFixed(1);
    hotel.reviews = hotel.userReviews.length;

    await hotel.save();

    // Mark booking as rated
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { hasRated: true });
    }

    res.status(200).json({
      message: "Review added successfully",
      rating: hotel.rating,
      reviews: hotel.reviews,
    });
  } catch (err) {
    next(err);
  }
};
