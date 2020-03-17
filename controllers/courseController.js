const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
// @access   Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    //Retorna cursos de um determinado bootcamp
    const courses = await Course.find({ bootcamp: bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    //Traz os cursos de acordo com os filtros ou todos os cursos sem filtro
    res.status(200).json(res.advancedResults);
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc     Get single course
// @route    GET /api/v1/courses
// @access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(
      new ErrorResponse(`Nenhum curso com a id de ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc     Create course
// @route    POST /api/v1/bootcamps/:bootcampId/courses
// @access   Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  req.body.bootcamp = bootcampId;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Nenhum bootcamp com a id de ${bootcampId}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc     Update course
// @route    PUT /api/v1/courses/:id
// @access   Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let course = await Course.findById(id);

  if (!course) {
    return next(
      new ErrorResponse(`Nenhum bootcamp com a id de ${bootcampId}`),
      404
    );
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc     Delete course
// @route    delete /api/v1/courses/:id
// @access   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Nenhum curso com a id de ${bootcampId}`),
      404
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
