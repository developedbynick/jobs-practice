const Factory = require("./factoryHandler");
const Comment = require("../models/commentModel");
exports.getComments = Factory.getAll(Comment);
exports.createComment = Factory.createOne(Comment);
exports.updateComment = Factory.updateOne(Comment);
exports.deleteComment = Factory.deleteOne(Comment);

exports.setEdited = (req, res, next) => {
  req.body = {
    body: req.body.body || "",
    edited: true,
  };
  next();
};
exports.populatePostBody = (req, res, next) => {
  if (req.params.jobId) req.body.job = req.params.jobId;
  if (!req.body.author) req.body.createdBy = req.user.id;
  next();
};
