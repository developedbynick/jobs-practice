const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, "A comment must have a body"],
    maxlength: [500, "A description must have less than 500 characters"],
    trim: true,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "A comment must have an author"],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  job: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "A comment must belong to a job"],
  },
});
commentSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
module.exports = mongoose.model("Comment", commentSchema);
