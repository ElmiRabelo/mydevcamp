// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Show all bootcamps"
  });
};

// @desc     Get bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `Show bootcamp ${id}`
  });
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Create new bootcamp"
  });
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `Update bootcamp ${id}`
  });
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `Delete bootcamp ${id}`
  });
};
