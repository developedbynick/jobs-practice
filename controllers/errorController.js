/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
const APIError = require("../utils/ApiError");

const handleValidationErrorDb = (err) => {
  const keys = Object.keys(err.errors);
  console.log(keys);
  const message = `${err.errors[keys[0]].message}`;
  return new APIError(message, 400);
};
const handleCastErrorDb = (err) => {
  const message = `Received an invalid ${err.path}: ${err.value}`;
  return new APIError(message, 400);
};
const handleDuplicateDocDb = (err) => {
  const duplicateKeyValues = Object.keys(err.keyValue);
  const message = `A document with ${
    duplicateKeyValues.length > 1 ? "the following keys" : "that"
  } '${duplicateKeyValues.join(", ")}' already exists`;
  return new APIError(message, 400);
};
const handleInvalidJWTToken = (err) => {
  const message = `Received an invalid or incomplete token`;
  return new APIError(message, 400);
};
const handleTokenExpired = (err) => {
  const message = `You're access token has expired. Please login to get a new one.`;
  return new APIError(message, 401);
};
module.exports = (err, req, res, next) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  let error = { ...err };
  if (err.name === "ValidationError") error = handleValidationErrorDb(err);
  if (err.name === "CastError") error = handleCastErrorDb(err);
  if (err.code === 11000) error = handleDuplicateDocDb(err);
  if (err.name === "JsonWebTokenError") error = handleInvalidJWTToken(err);
  if (err.name === "TokenExpiredError") error = handleTokenExpired(err);

  if (!(error instanceof APIError)) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  } else {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
};
