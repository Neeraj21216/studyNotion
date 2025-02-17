require("dotenv").config();
const mongoose = require("mongoose");

exports.dbConnect = () => {
    // Connect to the MongoDB database
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,      // Use new MongoDB URL parser
        useUnifiedTopology: true,  // Use new server discovery and monitoring engine
    })
    .then(() => {
        console.log("DB connected successfully!");
    })
    .catch((error) => {
        console.error("Error in DB connection:", error);
        process.exit(1); // Exit the process if the database connection fails
    });
};
