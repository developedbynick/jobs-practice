/* eslint-disable implicit-arrow-linebreak */
const jwt = require("jsonwebtoken");
module.exports = (payload) =>
  jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
