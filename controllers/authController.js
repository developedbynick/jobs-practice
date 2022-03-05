/* eslint-disable no-param-reassign */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const fs = require("fs");
const User = require("../models/userModel");
const generateAuthToken = require("../helpers/generateAuthToken");
const APIError = require("../utils/ApiError");
const sendMail = require("../utils/email");

const emailVerificationTemplate = fs.readFileSync(
  `${__dirname}/../templates/emailVerification.html`,
  "utf-8"
);
const sendEmail = async (user, otp, res) => {
  const emailTemplate = emailVerificationTemplate
    .replace("{%EMAIL%}", user.email)
    .replace("{%CODE%}", otp);
  await sendMail({
    subject: "Email Verification(Valid for 10 minutes)",
    html: emailTemplate,
    to: user.email,
  });
  user.emailVerificationToken = undefined;
  res.status(201).json({ user });
};
exports.signup = asyncHandler(async (req, res) => {
  // Creating User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const otp = await user.setupEmailVerification();
  // Removing properties from the document we will send to the user
  user.password = undefined;
  user.active = undefined;
  user.__v = undefined;
  // DO NOT CALL user.save(), IT WILL REMOVE THE PROPERTIES ABOVE FROM THE DATABASE
  // Generating auth token
  sendEmail(user, otp, res);
  // res.status(201).json({ status: "success", token, user });
});

exports.login = asyncHandler(async (req, res, next) => {
  // Get Email and password
  const { email, password } = req.body;
  // Find User with email
  const user = await User.findOne({ email }).select("+password");
  // Check if password is a match
  if (!user || !(await user.checkPasswords(password, user.password))) {
    return next(new APIError("Incorrect email or password", 404));
  }
  // create token
  const token = generateAuthToken(user.id);
  user.password = undefined;
  user.__v = undefined;
  // login user
  res.status(200).json({ status: "success", token, user });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp } = req.params;
  if (otp.length !== 6) {
    return next(
      new APIError("The length of the password should be equal to 5 characters")
    );
  }
  const encryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    emailVerificationToken: encryptedOtp,
    emailVerificationTokenExpiresAt: { $gt: Date.now() },
  });
  if (!user) return next(new APIError("Invalid or expired code", 400));
  user.emailVerified = true;
  user.emailVerificationTokenExpiresAt = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationCodeCanBeSentAt = undefined;
  await user.save({ validateBeforeSave: false });
  res.sendStatus(200);
});

exports.resendEmailVerificationCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
    emailVerificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (
    !user ||
    Date.now() < new Date(user.emailVerificationCodeCanBeSentAt).getTime()
  ) {
    return next(
      new APIError(
        "Incorrect email or there is an active timer on this account",
        400
      )
    );
  }

  const otp = await user.setupEmailVerification();
  sendEmail(user, otp, res);
});
