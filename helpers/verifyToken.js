/* eslint-disable implicit-arrow-linebreak */
const jwt = require("jsonwebtoken");
module.exports = (token) => jwt.verify(token, process.env.JWT_SECRET);
