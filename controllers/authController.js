const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Criando user no banco de dados
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  //Criar token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
});

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validando email e password
  if (!email || !password) {
    return next(new ErrorResponse("Digite um email e password válidos", 400));
  }

  //Checar se usuário são iguais.
  //Select está presente pois no model ele foi definido pra false
  //Assim se eu não especificar o password ele retorna o user sem esse campo
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user) {
    return next(new ErrorResponse("Informações invalidas", 401));
  }

  //verificando se passwords são compativeis
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Informações invalidas", 401));
  }

  //Gera o token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
});

// @desc     Current logged user
// @route    POST /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  //req.user contem as informações do token decodificadas e passadas pelo auth middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
