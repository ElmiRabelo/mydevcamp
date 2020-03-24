const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// @desc     Forgot Password
// @route    POST /api/v1/auth/forgotpassword
// @access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`Não existe nenhum usuário com este email`, 404)
    );
  }

  //Resetar o token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Criando a url de reset password
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Essa uma mensagem relacionanda ao pedido de alteração de senha. Clique no link a seguir para alterar sua senha: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Alteração de senha",
      message
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(
        `Pane na nave! Ocorreu algum erro ao enviar o email.`,
        500
      )
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc     Reset Password
// @route    POST /api/v1/auth/resetpassword:resettoken
// @access   Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Obter a senha com crypto
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  //Se usuário não for encontrado
  if (!user) {
    return next(new ErrorResponse("Token invalido", 400));
  }

  //Definir nova senha
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true
  });
});
