const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course',
    },
    materi: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lessons', lessonSchema);
