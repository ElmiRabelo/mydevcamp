const { Router } = require("express");
const Course = require("../models/Course");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
const { protect } = require("../middlewares/auth");

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
  .post(protect, addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);
module.exports = router;
