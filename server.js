const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middlewares/error");

//connect db
connectDB();

// Routes files
const bootcamps = require("./routes/bootcampRoutes");
const courses = require("./routes/courseRoutes");
const auth = require("./routes/authRoutes");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());

//File uploading
app.use(fileupload());
// Setando pasta estatica
app.use(express.static(path.join(__dirname, "public")));

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

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
