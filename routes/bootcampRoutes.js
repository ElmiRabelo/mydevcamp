const { Router } = require("express");
const {
  getBootcamps,
  getBootcamp,
  getBootcampsInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcampController");

//Incluir recursos de outra rota
const courseRoute = require("./courseRoutes");

//Inicilizar Router
const router = Router();

//Se rota for igual a esses valores, courseRoute será invocado e assumirá controle
router.use("/:bootcampId/courses", courseRoute);

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
