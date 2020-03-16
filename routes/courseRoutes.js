const { Router } = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const Course = require("../models/Course");
//Middleware de resultados avançados
const advancedResults = require("../middlewares/advancedResults");

//Preseva os valores de req.params da 'rota pai'. Nesse caso, de /:bootcampId/courses
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamps",
      select: "name description"
    }),
    getCourses
  )
  .post(addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);
module.exports = router;
