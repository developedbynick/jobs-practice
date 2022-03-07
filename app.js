/* eslint-disable consistent-return */
const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const meRouter = require("./routes/meRouter");
const commentRouter1 = require("./routes/commentRouter1");
const commentRouter2 = require("./routes/commentRouter2");
const errorController = require("./controllers/errorController");
const app = express();
// Middleware
app.use(express.json());
app.use(mongoSanitize());
// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);
app.use("/api/users/me", meRouter);
// Read the comment at the head of each router if you're confused, and become more familiar.
app.use("/api/comments", commentRouter1);
app.use("/api/jobs/comments/:jobId", commentRouter2);
// Error Handler
// eslint-disable-next-line no-unused-vars
app.use(errorController);
module.exports = app;
