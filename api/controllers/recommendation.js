import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import { createError } from "../utils/error.js";

// Calculate Pearson Correlation between two users
const calculatePearsonCorrelation = (userARatings, userBRatings) => {
  // Find common hotels rated by both users
  const commonHotels = Object.keys(userARatings).filter(
    (hotelId) => hotelId in userBRatings
  );

  if (commonHotels.length === 0) return 0;

  // Calculate means
  const meanA =
    commonHotels.reduce((sum, hotelId) => sum + userARatings[hotelId], 0) /
    commonHotels.length;
  const meanB =
    commonHotels.reduce((sum, hotelId) => sum + userBRatings[hotelId], 0) /
    commonHotels.length;

  // Calculate numerator and denominators
  let numerator = 0;
  let sumSquaredDiffA = 0;
  let sumSquaredDiffB = 0;

  commonHotels.forEach((hotelId) => {
    const diffA = userARatings[hotelId] - meanA;
    const diffB = userBRatings[hotelId] - meanB;

    numerator += diffA * diffB;
    sumSquaredDiffA += diffA * diffA;
    sumSquaredDiffB += diffB * diffB;
  });

  // Avoid division by zero
  const denominator = Math.sqrt(sumSquaredDiffA * sumSquaredDiffB);
  if (denominator === 0) return 0;

  return numerator / denominator;
};

// Get user ratings from hotel reviews
const getUserRatingsMap = async () => {
  const hotels = await Hotel.find({});
  const userRatings = {};

  hotels.forEach((hotel) => {
    hotel.userReviews.forEach((review) => {
      const userId = review.user.toString();
      if (!userRatings[userId]) {
        userRatings[userId] = {};
      }
      userRatings[userId][hotel._id.toString()] = review.rating;
    });
  });

  return userRatings;
};

// Predict rating for a user-hotel pair
const predictRating = (
  targetUserId,
  hotelId,
  userRatings,
  similarities,
  k = 10
) => {
  const targetUserRatings = userRatings[targetUserId] || {};

  // Calculate target user's average rating
  const targetUserRatingValues = Object.values(targetUserRatings);
  const targetUserMean =
    targetUserRatingValues.length > 0
      ? targetUserRatingValues.reduce((a, b) => a + b, 0) /
        targetUserRatingValues.length
      : 3; // Default to 3 if no ratings

  // Find users who rated this hotel
  const usersWhoRatedHotel = Object.keys(userRatings).filter(
    (userId) => userId !== targetUserId && hotelId in userRatings[userId]
  );

  if (usersWhoRatedHotel.length === 0) {
    return targetUserMean; // Return user's average if no similar users
  }

  // Sort by similarity and take top k similar users
  const similarUsers = usersWhoRatedHotel
    .map((userId) => ({
      userId,
      similarity: similarities[userId] || 0,
    }))
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);

  if (similarUsers.length === 0) {
    return targetUserMean;
  }

  // Calculate weighted average
  let numerator = 0;
  let denominator = 0;

  similarUsers.forEach(({ userId, similarity }) => {
    const userRatingValues = Object.values(userRatings[userId]);
    const userMean =
      userRatingValues.reduce((a, b) => a + b, 0) / userRatingValues.length;

    const rating = userRatings[userId][hotelId];
    numerator += similarity * (rating - userMean);
    denominator += Math.abs(similarity);
  });

  const predictedRating = targetUserMean + numerator / denominator;

  // Clamp between 1 and 5
  return Math.max(1, Math.min(5, predictedRating));
};

// Main recommendation function
export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Get all user ratings
    const userRatings = await getUserRatingsMap();

    // Check if target user exists
    if (!userRatings[userId]) {
      // User hasn't rated any hotels yet, return popular hotels
      const popularHotels = await Hotel.find({ rating: { $gte: 4 } })
        .sort({ reviews: -1, rating: -1 })
        .limit(10)
        .select("name city photos rating reviews cheapestPrice type");

      return res.status(200).json({
        recommendations: popularHotels,
        message: "Showing popular hotels (no ratings yet)",
        type: "popular",
      });
    }

    // Calculate similarities with all other users
    const similarities = {};
    const targetUserRatings = userRatings[userId];

    Object.keys(userRatings).forEach((otherUserId) => {
      if (otherUserId !== userId) {
        const similarity = calculatePearsonCorrelation(
          targetUserRatings,
          userRatings[otherUserId]
        );
        similarities[otherUserId] = similarity;
      }
    });

    // Get all hotels
    const allHotels = await Hotel.find({});

    // Get hotels the user has already rated
    const ratedHotelIds = Object.keys(targetUserRatings);

    // Predict ratings for unrated hotels
    const predictions = [];

    for (const hotel of allHotels) {
      const hotelId = hotel._id.toString();

      // Skip already rated hotels
      if (ratedHotelIds.includes(hotelId)) continue;

      const predictedRating = predictRating(
        userId,
        hotelId,
        userRatings,
        similarities
      );

      predictions.push({
        hotel,
        predictedRating,
      });
    }

    // Sort by predicted rating and take top 10
    predictions.sort((a, b) => b.predictedRating - a.predictedRating);
    const topRecommendations = predictions.slice(0, 10);

    // Format response
    const recommendations = topRecommendations.map((item) => ({
      ...item.hotel._doc,
      predictedRating: item.predictedRating.toFixed(2),
    }));

    res.status(200).json({
      recommendations,
      message: "Personalized recommendations based on your ratings",
      type: "personalized",
    });
  } catch (err) {
    next(err);
  }
};

// Get similar users (for debugging/analytics)
export const getSimilarUsers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userRatings = await getUserRatingsMap();

    if (!userRatings[userId]) {
      return next(createError(404, "User has no ratings yet"));
    }

    const targetUserRatings = userRatings[userId];
    const similarities = [];

    Object.keys(userRatings).forEach((otherUserId) => {
      if (otherUserId !== userId) {
        const similarity = calculatePearsonCorrelation(
          targetUserRatings,
          userRatings[otherUserId]
        );

        if (similarity > 0) {
          similarities.push({
            userId: otherUserId,
            similarity: similarity.toFixed(3),
          });
        }
      }
    });

    similarities.sort((a, b) => b.similarity - a.similarity);

    res.status(200).json({
      userId,
      similarUsers: similarities.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
};
