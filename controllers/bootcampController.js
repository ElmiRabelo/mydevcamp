const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocode");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc     Get bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const { id, role } = req.user;
  // Como é uma rota privada existe acesso a req.user que é o usuário logado.
  req.body.user = id;

  //Verificar bootcamp já publicado
  const publishedBootcamp = await Bootcamp.findOne({ user: id });

  //Impede que publisher adicione mais de um bootcamp
  if (publishedBootcamp && role !== "admin") {
    return next(
      new ErrorResponse(`O usuário de id ${id} já cadastrou um bootcamp`, 400)
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    message: "Created new bootcamp",
    data: bootcamp
  });
});

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  //Garantido que a operação só possa ser realizada pelo responsavel do bootcamp
  //O admin tem autoridade de realizar a operação
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user.name} não é o responsável por essa operação`,
        400
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  //Garantido que a operação só possa ser realizada pelo responsavel do bootcamp
  //O admin tem autoridade de realizar a operação
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user.name} não é o responsável por essa operação`,
        400
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ sucess: true, data: {} });
});

// @desc     Get bootcamp within a radius
// @route    DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Divide dist by radius of earth
  //Earth radius = 3,963mi / 6,378km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc     Upload photo
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   Private
exports.bootcampFileUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Não foi possível encontrar bootcamp de id ${req.params.id}`,
        404
      )
    );
  }

  //Garantido que a operação só possa ser realizada pelo responsavel do bootcamp
  //O admin tem autoridade de realizar a operação
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user.name} não é o responsável por essa operação`,
        400
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Por favor faça o upload de uma foto", 400));
  }
  const file = req.files.file;
  //Verificar se o arquivo é realmente uma imagem
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Faça upload de uma imagem`), 400);
  }
  //Verificar tamanho do arquivo
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse("O Tamanho da foto é muito grande."), 400);
  }

  //Nome personalizado para a foto
  //Path vai obter a extensão do arquivo
  file.name = `${bootcamp.name}-photo-${bootcamp._id}${
    path.parse(file.name).ext
  }`;

  //movendo o arquivo
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse("Houve um problema ao fazer upload do arquivo", 500)
      );
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      sucess: true,
      data: file.name
    });
  });
  console.log(req.files);
});
