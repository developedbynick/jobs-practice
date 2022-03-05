/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
module.exports =
  (...excludedFields) =>
  (req, res, next) => {
    excludedFields.forEach((field) => delete req.body[field]);
    next();
  };
