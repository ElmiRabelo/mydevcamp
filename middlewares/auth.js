const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const jwt = require("jsonwebtoken");

//Rotas protegidas
exports.protect = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith("Bearer")) {
    //Pega somente a parte do token, cortando o Bearer
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

  //Verificando se o token é valido
  //E cria no em req o valor de user
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

//Garantir acesso a uma role especifica
exports.authorize = (...roles) => {
  return (req, res, next) => {
    //verificando no user já logado pois possui as informações em req.user
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `O tipo de usuário ${req.user.role} não é autorizada para essa ação`,
          403
        )
      );
    }
    next();
  };
};
