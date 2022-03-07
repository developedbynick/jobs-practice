const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
// Setting the PORT
const PORT = process.env.PORT || 3000;
// Listening for requests
const server = app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}`);
});
const connectToDatabase = async () => {
  // Destructuring the connection variable
  const { connection: con } = await mongoose.connect(process.env.MONGO);
  // Logging a success message to the database
  console.log(`Successfully connected to "${con.name}" database`);
};

connectToDatabase();
process.on("uncaughtException", (err) => {
  console.log("ERROR💥💥", err.message);
  process.exit(1);
  server.close(() => console.log("The server has shut down gracefully"));
});
process.on("unhandledRejection", (err) => {
  console.log("ERROR💥💥", err.message);
  process.exit(1);
  server.close(() => console.log("The server has shut down gracefully"));
});
