const router = require('express').Router();
const authCTRL = require('../../controller/student/authCTRL');
const auth = require('../../middleware/auth');
const authStudent = require('../../middleware/authStudent');

router.post('/register', authCTRL.register);
router.post('/login', authCTRL.login);

router.get('/profile', auth, authStudent, authCTRL.getUser);
router.put(
  '/profile/update_data/:user_id',
  auth,
  authStudent,
  authCTRL.updateProfile
);
router.put(
  '/profile/update_password/:user_id',
  auth,
  authStudent,
  authCTRL.updatePassword
);

module.exports = router;
