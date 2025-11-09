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
//Cancel booking bu user
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(createError(404, "Booking not found"));
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return next(createError(403, "You can only cancel your own bookings"));
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return next(createError(400, "Booking is already cancelled"));
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    // Free up the room dates (remove unavailable dates)
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);

    const datesToRemove = [];
    const currentDate = new Date(checkInDate);

    while (currentDate <= checkOutDate) {
      datesToRemove.push(new Date(currentDate).getTime());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Update each room's unavailable dates
    // The booking.room array contains {roomId, roomNumber}
    for (const roomInfo of booking.room) {
      // Find the room by its roomId (ObjectId)
      const room = await Room.findById(roomInfo.roomId);

      if (room) {
        // Find the specific room number within the roomNumbers array
        const roomNumberIndex = room.roomNumbers.findIndex(
          (rn) => rn.number === roomInfo.roomNumber
        );

        if (roomNumberIndex !== -1) {
          // Remove the dates from unavailableDates
          room.roomNumbers[roomNumberIndex].unavailableDates = room.roomNumbers[
            roomNumberIndex
          ].unavailableDates.filter(
            (date) => !datesToRemove.includes(new Date(date).getTime())
          );

          await room.save();
        }
      }
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
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

export const getRevenueStats = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);

    const startOfMonth = new Date(today);
    startOfMonth.setDate(today.getDate() - 30);

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(startOfWeek.getDate() - 7);

    const previousMonthStart = new Date(startOfMonth);
    previousMonthStart.setDate(startOfMonth.getDate() - 30);

    // Today's revenue (confirmed and paid bookings)
    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Last 7 days revenue (excluding today)
    const weekRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lt: today },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Previous week (for comparison)
    const previousWeekRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: previousWeekStart, $lt: startOfWeek },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Last 30 days revenue (excluding last 7 days)
    const monthRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: startOfWeek },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Previous month (for comparison)
    const previousMonthRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonthStart, $lt: startOfMonth },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Total revenue this month (for target calculation)
    const thisMonthTotal = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: "confirmed",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Pending bookings (confirmed but not paid)
    const pendingRevenue = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          isPaid: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    const todayTotal = todayRevenue[0]?.total || 0;
    const weekTotal = weekRevenue[0]?.total || 0;
    const monthTotal = monthRevenue[0]?.total || 0;
    const previousWeekTotal = previousWeekRevenue[0]?.total || 0;
    const previousMonthTotal = previousMonthRevenue[0]?.total || 0;
    const thisMonthTotalAmount = thisMonthTotal[0]?.total || 0;

    // Monthly target (you can make this dynamic from a settings collection)
    const target = 50000;
    const currentProgress = (thisMonthTotalAmount / target) * 100;

    // Calculate percentage changes
    const weekChange =
      previousWeekTotal > 0
        ? (((weekTotal - previousWeekTotal) / previousWeekTotal) * 100).toFixed(
            1
          )
        : 0;

    const monthChange =
      previousMonthTotal > 0
        ? (
            ((monthTotal - previousMonthTotal) / previousMonthTotal) *
            100
          ).toFixed(1)
        : 0;

    res.status(200).json({
      today: todayTotal,
      todayCount: todayRevenue[0]?.count || 0,
      lastWeek: weekTotal,
      lastWeekCount: weekRevenue[0]?.count || 0,
      weekChange: parseFloat(weekChange),
      lastMonth: monthTotal,
      lastMonthCount: monthRevenue[0]?.count || 0,
      monthChange: parseFloat(monthChange),
      thisMonthTotal: thisMonthTotalAmount,
      target: target,
      progress: Math.min(currentProgress, 100),
      pending: pendingRevenue[0]?.total || 0,
      pendingCount: pendingRevenue[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
};
