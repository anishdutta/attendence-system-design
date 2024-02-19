import express, { Router } from 'express';
import validate from '../../modules/validate/validate.middleware';
import { AttendanceContoller, AttendanceValidator } from '../../modules/attendance';

const router: Router = express.Router();

router.post('/checkInAndOut', validate(AttendanceValidator.checkInAndOutInstructor), AttendanceContoller.checkInAndOut);
router.get('/getMonthlyAnalytics', validate(AttendanceValidator.getMonthlyAnalytics), AttendanceContoller.getMonthlyAnalytics);

export default router;