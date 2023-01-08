const router = require('express').Router();
const taskCTRL = require('../../controller/course/taskCTRL');
const auth = require('../../middleware/auth');
const authAdmin = require('../../middleware/authAdmin');
const authInstructor = require('../../middleware/authInstructor');
const authStudent = require('../../middleware/authStudent');

router
  .route('/task/:course_id')
  .post(auth, authAdmin, taskCTRL.createTask)
  .get(taskCTRL.getTask)
  .delete(auth, authAdmin, taskCTRL.deleteSingleTask);

router
  .route('/task/:course_id')
  .put(auth, authStudent, taskCTRL.submitTask)
  .get(auth, taskCTRL.getSingleTask);

router
  .route('/task_update/:task_id')
  .put(auth, authInstructor, taskCTRL.updateTask);

router
  .route('/mark_upload/:submission_id')
  .put(auth, authInstructor, taskCTRL.giveMark);

module.exports = router;
