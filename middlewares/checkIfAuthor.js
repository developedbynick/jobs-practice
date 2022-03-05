/* eslint-disable implicit-arrow-linebreak */
const asyncHandler = require("express-async-handler");
const roles = require("../constants/roles");
const APIError = require("../utils/ApiError");
module.exports = (Model) =>
  asyncHandler(async (req, res, next) => {
    // Checking if the user role is equal to an admin. If yes, we allow the admin to proceed.
    if (req.user.role === roles.roles[1]) return next();
    // Finding the resource to see if the user has access.
    const resource = await Model.findById(req.params.id);
    // Checking if the document exists
    if (!resource) {
      return next(new APIError("This document could not be found", 404));
    }
    // Checking if the createdBy field is equal to the logged in user's id.
    if (`${resource.createdBy}` === req.user.id) {
      return next();
    }
    // Returning an error if none of the above conditions are met.
    const message = `You are not authorized to perform this action`;
    return next(new APIError(message), 403);
  });
