const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    image: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const courseSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    title: {
      type: String,
      trim: true,
      require: true,
    },
    banner: {
      type: Object,
      require: true,
    },
    kelas: {
      type: String,
      require: true,
    },
    semester: {
      type: String,
      require: true,
    },
    jumlahPertemuan: {
      type: Number,
      require: true,
      trim: true,
    },
    category: {
      type: Array,
      default: [],
      require: true,
    },
    alokasiWaktu: {
      type: Number,
      require: true,
      trim: true,
    },
    jumlahSiswa: {
      type: Number,
      trim: true,
      default: 0,
    },
    indikatorPencapaianKompetensi: {
      type: Array,
      default: [],
      require: true,
    },
    metode: {
      type: Array,
      default: [],
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    instructor: {
      type: Object,
      require: true,
    },
    testimoni: [commentSchema],
    token: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
