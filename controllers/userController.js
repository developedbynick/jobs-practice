/* eslint-disable max-len */
/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const Factory = require("./factoryHandler");
const User = require("../models/userModel");
const APIError = require("../utils/ApiError");
const generateAuthToken = require("../helpers/generateAuthToken");
exports.attachUserId = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
exports.getUser = Factory.getOne(User);

exports.changePassword = asyncHandler(async (req, res, next) => {
  // Extracting the password details from the request body.
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  // Extracting the user from req.user(This comes from the protect middleware in the userRouter)
  const user = await User.findById(req.user.id).select("+password");
  // Checking if the current password submitted by the user is correct
  const isPasswordCorrect = await user.checkPasswords(
    currentPassword,
    user.password
  );
  // If the current password does not match the password in the database, throw an error.
  if (!isPasswordCorrect) {
    return next(new APIError("Incorrect password submitted", 400));
  }
  // Setting the password, passwordConfirm and the passwordChangedAt
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = new Date();
  // Saving the new user. This act will run all middleware including the hashing one.
  await user.save();
  // Generating auth token to send to user
  const token = generateAuthToken(user.id);
  // Omitting the password details from the user object that is going to be sent.
  user.password = undefined;
  user.passwordChangedAt = undefined;
  // DO NOT CALL USER.SAVE(). The password and passwordChangedAt fields will  be removed from the database.
  // Sending a response to the user/logging the user in. This will render all other tokens invalid.
  res.status(200).json({
    token,
    user,
  });
});
