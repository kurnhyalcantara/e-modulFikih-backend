const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCTRL = {
  uploadFile: (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'Tidak ada file yang dipilih' });
      }
      const file = req.files.file;
      if (file.size > 5120 * 5120) {
        removeTmp(file.tempFilePath);
        return res
          .status(400)
          .json({ msg: 'Ukuran gambar terlalu besar, harus dibawah 10 MB' });
      }
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ msg: 'Format gambar tidak diizinkan' });
      }
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: 'Fikih MTs Bontouse' },
        async (err, result) => {
          if (err) throw err;
          removeTmp(file.tempFilePath);
          res.json({ url: result.secure_url });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteFile: (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        return res.status(400).json({ msg: 'No image is selected.' });
      }
      cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;
        res.json({ msg: 'Image Deleted.' });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCTRL;
