const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A job must have a title"],
      minlength: [5, "A job title must have a minimum of 5 characters"],
      maxlength: [
        45,
        "A job title must have a maximum of 45 characters. Consider adding more info in the description",
      ],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "A job must have a description"],
      maxlength: [700, "A description must have less than 700 characters"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "A job must have a summary"],
      maxlength: [50, "A summary must have less than 50 characters"],
    },
    salary: {
      type: Number,
      required: [true, "A job must have a salary"],
    },
    salaryPayedEvery: {
      type: String,
      required: [
        true,
        "A salary must be payed  monthly, weekly, daily or yearly",
      ],
      enum: {
        values: ["monthly", "weekly", "daily", "yearly"],
        message:
          "Could not accept ({VALUE}). Salary is either paid on a monthly, weekly, daily or yearly basis.",
      },
      lowercase: true,
    },
    qualifications: {
      type: [String],
      validate: {
        validator(el) {
          return el.length <= 20;
        },
        message: "The number of qualifications must be equal to or below 20",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    neededForPosition: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "A job must have a creator"],
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Indexing
jobSchema.index({ salary: 1 });

jobSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  this.select("-__v");
  next();
});
jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy nComments",
    select: "name",
  });
  next();
});
// Virtuals
jobSchema.virtual("nComments", {
  ref: "Comment",
  foreignField: "job",
  localField: "_id",
  count: true,
});
module.exports = mongoose.model("Job", jobSchema);
