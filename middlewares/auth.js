const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const jwt = require("jsonwebtoken");

//Rotas protegidas
exports.protect = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith("Bearer")) {
    //Pegando o token
    token = authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  //Se token não existir
  if (!token) {
    return next(
      new ErrorResponse("Sem autorização para acessar esta rota"),
      401
    );
  }

  //Verificando token e obtendo o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(
      new ErrorResponse("Sem autorização para acessar esta rota"),
      401
    );
  }
});
