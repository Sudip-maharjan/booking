import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { 
  generateVerificationToken, 
  sendVerificationEmail,
  sendWelcomeEmail 
} from "../utils/emailService.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = new User({
      ...req.body,
      password: hash,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(
        newUser.email, 
        newUser.username, 
        verificationToken
      );
      
      res.status(200).json({ 
        message: "Registration successful! Please check your email to verify your account.",
        email: newUser.email 
      });
    } catch (emailError) {
      // If email fails, still create the user but notify
      console.error("Failed to send verification email:", emailError);
      res.status(200).json({ 
        message: "Registration successful, but verification email could not be sent. Please contact support.",
        email: newUser.email 
      });
    }
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log("Verification attempt with token:", token);

    // Find user with this token
    const user = await User.findOne({
      verificationToken: token,
    });

    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      console.log("Token expiry:", user.verificationTokenExpiry);
      console.log("Current time:", new Date());
      console.log("Is expired:", user.verificationTokenExpiry < Date.now());
    }

    if (!user) {
      return next(createError(400, "Invalid verification token. Please request a new verification email."));
    }

    // Check if token is expired
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
      return next(createError(400, "Verification token has expired. Please request a new verification email."));
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(200).json({ 
        message: "Email already verified! You can login now." 
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    console.log("User verified successfully");

    // Send welcome email (don't fail if this doesn't work)
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailErr) {
      console.log("Welcome email failed:", emailErr);
    }

    res.status(200).json({ 
      message: "Email verified successfully! You can now login." 
    });
  } catch (err) {
    console.error("Verification error:", err);
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.isVerified) {
      return next(createError(400, "Email is already verified"));
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.status(200).json({ 
      message: "Verification email resent successfully!" 
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // Check if email is verified
    if (!user.isVerified) {
      return next(createError(403, "Please verify your email before logging in"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};