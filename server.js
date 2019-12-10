const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

//connect db
connectDB();

// Routes files
const bootcamps = require("./routes/bootcampRoutes");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server & exit process
  server.close(() => process.exit(1));
});
