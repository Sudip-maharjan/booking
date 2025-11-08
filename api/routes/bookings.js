import express from "express";
import {
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getHotelBookings,
  getUserBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getRevenueStats,
} from "../controllers/booking.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// revenue
router.get("/revenue-stats", verifyAdmin, getRevenueStats);

// CREATE - User must be authenticated
router.post("/", verifyToken, createBooking);

// GET all bookings - Admin only
router.get("/", verifyAdmin, getBookings);

// GET bookings by user ID - User must be authenticated
router.get("/user/:userId", verifyUser, getUserBookings);

// GET bookings for a specific hotel (for availability checking)
router.get("/hotel/:hotelId", getHotelBookings);

// GET single booking - User must own the booking or be admin
router.get("/:id", verifyToken, getBooking);

// UPDATE booking status - Admin only
router.put("/:id/status", verifyAdmin, updateBookingStatus);

// UPDATE payment status - Admin only
router.put("/:id/payment", verifyAdmin, updatePaymentStatus);

// DELETE booking - Admin only
router.delete("/:id", verifyAdmin, deleteBooking);

export default router;
