import express from "express";
import {
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
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
