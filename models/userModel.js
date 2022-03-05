/* eslint-disable consistent-return */
const mongoose = require("mongoose");
const validator = require("validator").default;
const bcrypt = require("bcryptjs");
const otp = require("otp-generator");
const crypto = require("crypto");
const roles = require("../constants/roles");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "A user must have a valid email address",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: roles.roles,
      message: "A user can only have a role of user, employer or simply user",
    },
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "A password must have a minimum of 8 characters"],
    maxlength: [62, "A password must have a maximum of 62 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must confirm their password"],
    validate: {
      validator(el) {
        return this.password === el;
      },
      message: "The passwords received do not match",
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
  passwordResetToken: String,
  emailVerificationToken: String,
  emailVerificationCodeCanBeSentAt: Date,
  emailVerificationTokenExpiresAt: Date,
  canSendPasswordResetTokenAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  // Removing the passwordConfirm field
  this.passwordConfirm = undefined;
  // On to the next middleware.
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  this.select("-__v");
  next();
});
// instance methods
userSchema.methods.checkPasswords = async (
  candidatePassword,
  accountPassword
) => bcrypt.compare(candidatePassword, accountPassword);

// Generate account verification
userSchema.methods.setupEmailVerification = async function () {
  const token = otp.generate(6, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationCodeCanBeSentAt = Date.now() + 1 * 60 * 1000;
  this.emailVerificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  await this.save({ validateBeforeSave: false });
  return token;
};

module.exports = mongoose.model("User", userSchema);
