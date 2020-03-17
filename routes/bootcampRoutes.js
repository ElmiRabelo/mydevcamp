const { Router } = require("express");
const Bootcamp = require("../models/Bootcamp");
const {
  getBootcamps,
  getBootcamp,
  getBootcampsInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampFileUpload
} = require("../controllers/bootcampController");
const { protect, authorize } = require("../middlewares/auth");

//Middleware de recursos avançados
const advancedResults = require("../middlewares/advancedResults");

//Incluir recursos de outra rota
const courseRoute = require("./courseRoutes");

//Inicilizar Router
const router = Router();

//Se rota for igual a esses valores, courseRoute será invocado e assumirá controle
router.use("/:bootcampId/courses", courseRoute);

//Rota de upload de foto
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampFileUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
