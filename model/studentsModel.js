const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    namaLengkap: {
      type: String,
      require: true,
      trim: true,
    },
    nis: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    kelas: {
      type: String,
      require: true,
      trim: true,
    },
    mobile: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    enrolled: {
      type: Array,
      default: [],
    },
    image: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
