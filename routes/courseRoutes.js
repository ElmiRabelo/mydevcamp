const { Router } = require("express");
const { getCourses } = require("../controllers/courseController");

//Possibilita controlar rotas especificas de outros recursos/rotas
const router = Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
