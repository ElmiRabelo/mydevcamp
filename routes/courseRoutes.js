const { Router } = require("express");
const {
  getCourses,
  getCourse,
  addCourse
} = require("../controllers/courseController");

//Preseva os valores de req.params da 'rota pai'. Nesse caso, de /:bootcampId/courses
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getCourses)
  .post(addCourse);

router.route("/:id").get(getCourse);

module.exports = router;
