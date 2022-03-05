/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const asyncHandler = require("express-async-handler");
const APIError = require("../utils/ApiError");
const verifyToken = require("../helpers/verifyToken");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res, next) => {
  // Extract token from the headers
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return next(new APIError("Invalid token", 401));
  }
  token = token.split("Bearer ")[1];
  // Verify the token
  const decoded = verifyToken(token);
  // Find the user -> This is because the user may have been deleted.
  const user = await User.findById(decoded.id);
  if (!user) return next(new APIError("This user no longer exists", 400));
  // Check if the user is verified
  if (user.emailVerified !== true) {
    return next(new APIError("Please verify your account", 401));
  }
  // check if the passwordChangedAt is greater than the iat
  if (new Date(user.passwordChangedAt) > new Date(decoded.iat * 1000)) {
    return next(new APIError("Password change detected. Please login", 401));
  }
  // Setting the user on the request object
  req.user = user;
  next();
});
