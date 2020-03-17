const { Router } = require("express");
const { register, login } = require("../controllers/authController");

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
