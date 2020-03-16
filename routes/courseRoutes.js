const { Router } = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

//Preseva os valores de req.params da 'rota pai'. Nesse caso, de /:bootcampId/courses
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getCourses)
  .post(addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);
module.exports = router;
