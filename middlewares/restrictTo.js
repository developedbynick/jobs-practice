/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
const APIError = require("../utils/ApiError");

module.exports =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError("You are not authorized to perform this action", 403)
      );
    }
    next();
  };
