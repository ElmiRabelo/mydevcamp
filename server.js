const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

// Routes files
const bootcamps = require("./routes/bootcampRoutes");

const app = express();

// Middlewares

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
