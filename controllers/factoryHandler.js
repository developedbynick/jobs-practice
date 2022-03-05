/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
const asyncHandler = require("express-async-handler");
const APIError = require("../utils/ApiError");
const APIFeatures = require("../utils/ApiFeatures");

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.params.jobId) filter = { ...filter, job: req.params.jobId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limit()
      .paginate()
      .sort();
    const docs = await features.query;
    res.json({ status: "success", results: docs.length, data: docs });
  });

//   prettier-ignore
// eslint-disable-next-line consistent-return
exports.createOne = (Model) => asyncHandler(async (req, res, next) => {
  if (Array.isArray(req.body)) {
    return next(new APIError("Expected typeof object, not typeof array", 400));
  }
  const doc = await Model.create(req.body);
  // eslint-disable-next-line no-underscore-dangle
  doc.__v = undefined;
  res.status(201).json({ status: "success", data: doc });
});

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, { active: false });
    if (!doc) {
      return next(
        new APIError("A document with that ID could not be found", 404)
      );
    }
    res.sendStatus(204);
  });

exports.getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(
        new APIError("A document with that ID could not be found", 404)
      );
    }
    res.status(200).json({ status: "success", data: doc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new APIError("A document with that ID could not be found", 404)
      );
    }
    res.status(200).json({ status: "success", data: doc });
  });
