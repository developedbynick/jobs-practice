/* eslint-disable consistent-return */
const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const meRouter = require("./routes/meRouter");
const commentRouter = require("./routes/commentRouter");
const commentRouter2 = require("./routes/commentRouter2");
const app = express();
const APIError = require("./utils/ApiError");
// Middlewares
app.use(express.json());
app.use(mongoSanitize());
// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);
app.use("/api/users/me", meRouter);
app.use("/api/jobs/comments/:jobId", commentRouter);
app.use("/api/comments/", commentRouter2);
// Error Handler
// eslint-disable-next-line consistent-return
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.log(err.message);
  res.status(500).send(err);
});
module.exports = app;
