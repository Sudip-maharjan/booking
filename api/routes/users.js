import express from "express";
import {
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello user, you are logged in and you can delete your account");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("hello Admin, you are logged in and you can delete all account");
});

//update
router.put("/:id", updateHotel);

//delete
router.delete("/:id", deleteHotel);

//get
router.get("/:id", getHotel);

//get all
router.get("/", getHotels);

export default router;
