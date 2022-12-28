const mongoose = require('mongoose');

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
    class: {
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
      type: String,
      require: true,
    },
    alokasiWaktu: {},
    jumlahSiswa: {
      type: Number,
      trim: true,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    about: {
      type: String,
      require: true,
    },

    enrolled: {
      type: Number,
      default: 0,
    },
    objective: {
      type: Array,
      default: [],
    },
    requirements: {
      type: Array,
      default: [],
    },
    instructor: {
      type: Object,
      require: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
