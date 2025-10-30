const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/attendance', attendanceController.markAttendance);
router.get('/attendance', attendanceController.getAllAttendance);
router.get('/attendance/employee/:employeeID', attendanceController.getAttendanceByEmployee);
router.get('/attendance/date/:date', attendanceController.getAttendanceByDate);
router.get('/attendance/search/:query', attendanceController.searchAttendance);
router.delete('/attendance/:id', attendanceController.deleteAttendance);
router.get('/attendance/stats/:employeeID/:year/:month', attendanceController.getEmployeeStatistics);

module.exports = router;