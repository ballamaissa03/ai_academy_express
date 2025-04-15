const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriberSchema = new Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est requis."],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Veuillez entrer une adresse email valide.",
    ],
  },
  zipCode: {
    type: String,
    required: [true, "Le code postal est requis."],
    match: [/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres."],
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
