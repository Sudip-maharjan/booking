import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";

// Create a new booking
export const createBooking = async (req, res, next) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// Get all bookings (admin only)
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email")
      .populate("hotel", "name city")
      .populate("room.roomId", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Get a single booking by ID
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "username email phone")
      .populate("hotel", "name city address")
      .populate("room.roomId", "title price");

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

// Get bookings by user ID
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("hotel", "name city address photos")
      .populate("room.roomId", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Update booking status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return next(createError(400, "Invalid status"));
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return next(createError(404, "Booking not found"));
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// Update booking payment status
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { isPaid } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isPaid },
      { new: true }
    );

    if (!updatedBooking) {
      return next(createError(404, "Booking not found"));
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// Delete a booking
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json("Booking has been deleted");
  } catch (err) {
    next(err);
  }
};

// Get hotel bookings (for checking availability)
export const getHotelBookings = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const bookings = await Booking.find({
      hotel: req.params.hotelId,
      status: { $ne: "cancelled" },
      $or: [
        {
          checkInDate: { $lte: new Date(endDate) },
          checkOutDate: { $gte: new Date(startDate) },
        },
      ],
    }).populate("room.roomId");

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};
