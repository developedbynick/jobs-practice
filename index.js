const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const connectToDatabase = async () => {
  try {
    // Setting the PORT
    const PORT = process.env.PORT || 3000;
    // Destructuring the connection variable
    const { connection: con } = await mongoose.connect(process.env.MONGO);
    // Logging a success message to the database
    console.log(`Successfully connected to "${con.name}" database`);
    // Listening for requests.
    app.listen(PORT, () => {
      console.log(`Listening for requests on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

connectToDatabase();
