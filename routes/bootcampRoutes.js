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
const { protect } = require("../middlewares/auth");

//Middleware de recursos avançados
const advancedResults = require("../middlewares/advancedResults");

//Incluir recursos de outra rota
const courseRoute = require("./courseRoutes");

//Inicilizar Router
const router = Router();

//Se rota for igual a esses valores, courseRoute será invocado e assumirá controle
router.use("/:bootcampId/courses", courseRoute);

//Rota de upload de foto
router.route("/:id/photo").put(protect, bootcampFileUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
