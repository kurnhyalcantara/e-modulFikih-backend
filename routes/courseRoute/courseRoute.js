const router = require('express').Router();
const courseCTRL = require('../../controller/course/courseCTRL');
const auth = require('../../middleware/auth');
const authAdmin = require('../../middleware/authAdmin');
const authInstructor = require('../../middleware/authInstructor');
const authStudent = require('../../middleware/authStudent');

router
  .route('/course')
  .post(auth, authAdmin, courseCTRL.createCourse)
  .get(auth, authAdmin, courseCTRL.adminCourse);

router.get('/all_course', courseCTRL.getCourse);
router.get('/all/course', courseCTRL.getAllCourse);

router
  .route('/course_details/:course_id')
  .get(courseCTRL.courseDetails)
  .put(auth, authAdmin, courseCTRL.updateCourse)
  .delete(auth, authAdmin, courseCTRL.deleteCourse);

router
  .route('/course/review/:course_id')
  .put(auth, authStudent, courseCTRL.reviewCourse);

router
  .route('/course/enroll/:course_id')
  .patch(auth, authStudent, courseCTRL.enrollCourse);

module.exports = router;
