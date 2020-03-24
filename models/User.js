const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Adicione um nome de usuário"]
  },
  email: {
    type: String,
    required: [true, "Adicione um email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Adicione um email valido"
    ]
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user"
  },
  password: {
    type: String,
    require: [true, "Adicione uma senha"],
    minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Encriptando password usando bcryptjs
UserSchema.pre("save", async function(next) {
  //Se for um save do campo password modificado
  //Reset password entra nisso
  if (!this.isModified("passowrd")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sigin JWT e retornando os valores
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//Comparando password informado no login com password no db
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

//Gerar token e cryptografar com hash
UserSchema.methods.getResetPasswordToken = async function() {
  //Gerar o Token e retornar em formato String
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Cryptografar password e definir token para o resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Definir tempo para expirar
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
