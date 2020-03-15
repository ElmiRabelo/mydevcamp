const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Adicione um titulo para o curso"]
  },
  description: {
    type: String,
    required: [true, "Adicione uma descrição do curso"]
  },
  weeks: {
    type: String,
    required: [true, "Adicione a duração do curso em semanas"]
  },
  tuition: {
    type: Number,
    required: [true, "Adicione o custo do curso"]
  },
  minimunSkill: {
    type: [String],
    required: [
      true,
      "Adicione as habilidades e conhecimentos necessários para poder participar"
    ],
    enum: ["Iniciante", "Intermediário", "Avançado"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
});

module.exports = mongoose.model("Course", CourseSchema);
