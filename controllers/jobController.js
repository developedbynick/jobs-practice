const Factory = require("./factoryHandler"); // Not a class
const Job = require("../models/jobModel");

exports.getAllJobs = Factory.getAll(Job);
exports.getOne = Factory.getOne(Job);
exports.createJob = Factory.createOne(Job);
exports.deleteJob = Factory.deleteOne(Job);
exports.updateOne = Factory.updateOne(Job);
