const router = require('express').Router();
const lessonCTRL = require('../../controller/course/lessonCTRL');
const auth = require('../../middleware/auth');
const authAdmin = require('../../middleware/authAdmin');
const authStudent = require('../../middleware/authStudent');

router
  .route('/lesson/:course_id')
  .post(auth, authAdmin, lessonCTRL.createLesson)
  .get(lessonCTRL.getSingleLesson);

router.route('/lesson/:lesson_id').put(auth, lessonCTRL.updateLesson);

router
  .route('/lesson_details/:lesson_id')
  // .get(auth, authAdmin, lessonCTRL.getSingleLesson)
  .delete(auth, authAdmin, lessonCTRL.deleteLesson);

module.exports = router;
