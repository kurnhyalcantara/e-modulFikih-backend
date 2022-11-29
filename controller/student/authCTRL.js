const Student = require('../../model/studentsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authCTRL = {
  register: async (req, res) => {
    try {
      const { namaLengkap, nis, kelas, mobile, password } = req.body;

      if (!namaLengkap || !nis || !kelas || !mobile || !password) {
        return res
          .status(400)
          .json({ msg: 'Harap isi semua data yang dibutuhkan' });
      }

      // const parent = await Parent.findOne({ nid });
      // if (!parent) {
      //   return res.status(400).json({ msg: 'This NID Not Exists.' });
      // }
      // if (parent.mobile !== mobile) {
      //   return res.status(400).json({ msg: 'Mobile Number Not Matched.' });
      // }
      const existingUser = await Student.findOne({ nis });
      if (existingUser) {
        return res.status(400).json({ msg: 'Akun sudah terdaftar' });
      }
      if (password.length < 4) {
        return res
          .status(400)
          .json({ msg: 'Password harus lebih dari 4 karakter' });
      }
      const hashPass = await bcrypt.hash(password, 10);
      const newStudent = new Student({
        namaLengkap,
        nis,
        kelas,
        mobile,
        password: hashPass,
      });

      await newStudent.save();
      const accessToken = createAccessToken({ id: newStudent._id });
      const refreshToken = createRefreshToken({ id: newStudent._id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });

      res.json({
        accessToken,
        user: { name: newStudent.name, type: newStudent.type },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: async (req, res) => {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token) {
      return res.status(400).json({ msg: 'Silahkan Login atau Buat Akun' });
    }
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, student) => {
      if (err) {
        return res.status(400).json({ msg: 'Silahkan Login atau Buat Akun' });
      }
      const accessToken = createAccessToken({ id: student.id });

      res.json({ accessToken });
    });
  },
  login: async (req, res) => {
    try {
      const { nis, password } = req.body;
      if (!nis || !password) {
        return res
          .status(400)
          .json({ msg: 'Harap masukkan data dengan benar' });
      }
      const user = await Student.findOne({ nis });
      if (!user) {
        return res.status(400).json({ msg: 'Akun tidak terdaftar' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Password tidak cocok.' });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });

      res.json({ accessToken, user: { name: user.name, type: user.type } });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
      });
      return res.json({ msg: 'Anda telah logout' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const student = await Student.findById(req.user.id).select('-password');
      if (!student) {
        return res.status(400).json({ msg: "User Doesn't Exists." });
      }
      res.json({ student });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (student) => {
  return jwt.sign(student, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

const createRefreshToken = (student) => {
  return jwt.sign(student, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = authCTRL;
