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
  minimumSkill: {
    type: String,
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

//Metodo estatico para obter o custo médio de taxas dos cursos
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

//Invocar getAverageCost depois de salvar
CourseSchema.post("save", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

//Invocar getAverageCost antes de remover
CourseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
