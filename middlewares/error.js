const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  //Log to console for dev mode
  console.log(err.stack.red);

  //Mongoose bad cast ObjectID - Error ao não encontrar item com ID
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate error - Valores duplicados
  if (err.code === 11000) {
    const message = "Duplicated value found.";
    error = new ErrorResponse(message, 400);
  }

  //Validation Error - Error ao criar item faltando campo necessário
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
