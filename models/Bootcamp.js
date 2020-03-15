const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocode");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Adicione um nome"],
    trim: true,
    maxlength: [50, "Nome não pode ter mais de 50 letras"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Adicione uma descrição"],
    maxlength: [500, "Descrições não podem passar de 500 letras"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Adicione uma URL valida, HTTP ou HTTPS"
    ]
  },
  phone: {
    type: String,
    maxlength: [20, "Número de telefone não pode ter mais de 20 caracteres"]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Adicione um email valido"
    ]
  },
  address: {
    type: String,
    required: [true, "Adicione um endereço"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    //Array of string
    type: [String],
    required: true,
    enum: [
      "Desenvolvimento Web",
      "Desenvolvimento Mobile",
      "UI/UX",
      "Ciência de Dados",
      "Negócios",
      "Outros"
    ]
  },
  averageRating: {
    type: Number,
    min: [1, "Nota deve ser pelo menos 1"],
    max: [10, "Nota pode ser no máximo 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Create a bootcamp slug from the name
BootcampSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode and create location field
BootcampSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  console.log(loc);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };
  //Do not save address in DB
  this.address = undefined;

  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
