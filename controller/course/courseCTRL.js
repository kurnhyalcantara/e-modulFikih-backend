const Course = require('../../model/courseModel');
const Tasks = require('../../model/taskModel');
const Lessons = require('../../model/lessonModel');
const Instructor = require('../../model/instructorModel');
const Student = require('../../model/studentsModel');
const Admin = require('../../model/adminModel');
const bcrypt = require('bcrypt');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => '$' + match
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 8;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const courseCTRL = {
  createCourse: async (req, res) => {
    try {
      const {
        title,
        banner,
        kelas,
        semester,
        jumlahPertemuan,
        category,
        alokasiWaktu,
        indikatorPencapaianKompetensi,
        metode,
        description,
        token,
      } = req.body;
      if (
        !title ||
        !banner ||
        !kelas ||
        !semester ||
        !jumlahPertemuan ||
        !category ||
        !alokasiWaktu ||
        !indikatorPencapaianKompetensi ||
        !metode ||
        !description ||
        !token
      ) {
        return res.status(400).json({ msg: 'Invalid Course Credentials.' });
      }
      if (!banner) {
        return res.status(400).json({ msg: 'No Image is Selected.' });
      }
      const user = req.user.id;
      const admin = await Admin.findOne({ _id: user }).select('-password');
      const hashToken = await bcrypt.hash(token, 10);
      const newCourse = new Course({
        creator: user,
        title,
        banner,
        kelas,
        semester,
        jumlahPertemuan,
        category,
        alokasiWaktu,
        indikatorPencapaianKompetensi,
        metode,
        description,
        instructor: admin,
        token: hashToken,
      });
      await newCourse.save();
      res.json({ msg: 'Created a Course.', course: newCourse });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getCourse: async (req, res) => {
    try {
      const features = new APIfeatures(Course.find(), req.query)
        .filtering()
        .paginating();

      const courses = await features.query;

      res.json({
        status: 'success',
        result: courses.length,
        courses: courses,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllCourse: async (req, res) => {
    try {
      const course = await Course.find({});
      res.json({
        status: 'success',
        result: course.length,
        courses: course,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  courseDetails: async (req, res) => {
    try {
      const course_id = req.params.course_id;
      const courseDetails = await Course.findOne({ _id: course_id });
      const tasks = await Tasks.find({ course_id: course_id }).select(
        '-course_id'
      );
      const lessons = await Lessons.find({ course_id: course_id }).select(
        '-course_id'
      );
      res.json({ courseDetails: courseDetails, tasks, lessons });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const {
        title,
        banner,
        kelas,
        semester,
        jumlahPertemuan,
        category,
        alokasiWaktu,
        indikatorPencapaianKompetensi,
        metode,
        description,
      } = req.body;
      if (
        !title ||
        !banner ||
        !kelas ||
        !semester ||
        !jumlahPertemuan ||
        !category ||
        !alokasiWaktu ||
        !indikatorPencapaianKompetensi ||
        !metode ||
        !description
      ) {
        return res.status(400).json({ msg: 'Inavild Course Details' });
      }
      if (!banner) {
        return res.status(400).json({ msg: 'No Image is Selected' });
      }
      await Course.findOneAndUpdate(
        { _id: req.params.course_id },
        {
          title,
          banner,
          kelas,
          semester,
          jumlahPertemuan,
          category,
          alokasiWaktu,
          indikatorPencapaianKompetensi,
          metode,
          description,
        }
      );
      res.json({ msg: 'Course is Updated.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteCourse: async (req, res) => {
    try {
      await Course.findByIdAndDelete(req.params.course_id);
      res.json({ msg: 'Course is Deleted' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  reviewCourse: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      if (!rating || !comment) {
        return res.status(400).json({ msg: 'Komentar tidak valid' });
      }
      if (comment.length < 3) {
        return res.status(400).json({ msg: 'Komentar anda terlalu pendek' });
      }
      const course = await Course.findById(req.params.course_id);
      if (!course) {
        return res.status(400).json({ msg: 'Course Not Found.' });
      }
      const user = req.user.id;
      const author = await Student.findOne({ _id: user });
      course.testimoni.push({
        rating,
        comment,
        author: author.namaLengkap,
        image: author.image,
      });
      course.save();
      res.json({ msg: 'Successfully Commented.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  adminCourse: async (req, res) => {
    try {
      const courses = await Course.find({ user: req.user.id });
      res.json(courses);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  enrollCourse: async (req, res) => {
    try {
      const { enrolled, token } = req.body;
      const user = await Student.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      const courseId = req.params.course_id;
      const course = await Course.findOne({ courseId });
      const isMatchToken = await bcrypt.compare(token, course.token);
      if (!isMatchToken) {
        return res.status(500).json({ msg: 'Token Salah' });
      } else {
        await Student.findOneAndUpdate(
          { _id: req.user.id },
          {
            enrolled: enrolled,
          }
        );
        req.body.enrolled.filter((item) => {
          return totalEnrolled(
            item.courseDetails._id,
            item.courseDetails.jumlahSiswa
          );
        });
        return res.json({ msg: 'Enrolled' });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // createLessons: async (req, res) => {
  //   try {
  //     const { heading, videos } = req.body;
  //     if (!heading || !videos) {
  //       return res.status(400).json({ msg: "Invalid Lesoons." });
  //     }
  //     const course = await Course.findById(req.params.course_id);
  //     if (!course) {
  //       return res.status(400).json({ msg: "Course Not Found." });
  //     }
  //     course.videos.push({
  //       heading,
  //       videos,
  //     });
  //     course.save();
  //     res.json({ msg: "Successfully Added Lesson." });
  //   } catch (error) {
  //     return res.status(500).json({ msg: error.message });
  //   }
  // },
};

const totalEnrolled = async (id, oldEnrolled) => {
  await Course.findOneAndUpdate(
    { _id: id },
    {
      jumlahSiswa: 1 + oldEnrolled,
    }
  );
};

module.exports = courseCTRL;
