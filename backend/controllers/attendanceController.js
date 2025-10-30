const Attendance = require('../models/Attendance');

const attendanceController = {
    async markAttendance(req, res, next) {
        try {
            const { employeeName, employeeID, date, status } = req.body;
            
            if (!employeeName || !employeeID || !date || !status) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'All fields are required' 
                });
            }

            // Check if attendance already marked for this employee on this date
            const existingRecords = await Attendance.getByDate(date);
            const existing = existingRecords.find(record => 
                record.employeeID === employeeID && record.formatted_date === date
            );

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Attendance already marked for this employee on the selected date'
                });
            }

            const result = await Attendance.create({ employeeName, employeeID, date, status });
            
            res.status(201).json({
                success: true,
                message: 'Attendance marked successfully',
                data: { id: result.insertId, employeeName, employeeID, date, status }
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllAttendance(req, res, next) {
        try {
            const attendance = await Attendance.getAll();
            res.json({
                success: true,
                data: attendance,
                count: attendance.length
            });
        } catch (error) {
            next(error);
        }
    },

    async getAttendanceByEmployee(req, res, next) {
        try {
            const { employeeID } = req.params;
            const attendance = await Attendance.getByEmployeeId(employeeID);
            res.json({
                success: true,
                data: attendance,
                count: attendance.length
            });
        } catch (error) {
            next(error);
        }
    },

    async getAttendanceByDate(req, res, next) {
        try {
            const { date } = req.params;
            const attendance = await Attendance.getByDate(date);
            res.json({
                success: true,
                data: attendance,
                count: attendance.length
            });
        } catch (error) {
            next(error);
        }
    },

    async searchAttendance(req, res, next) {
        try {
            const { query } = req.params;
            const attendance = await Attendance.search(query);
            res.json({
                success: true,
                data: attendance,
                count: attendance.length
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteAttendance(req, res, next) {
        try {
            const { id } = req.params;
            const result = await Attendance.delete(id);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found'
                });
            }

            res.json({
                success: true,
                message: 'Attendance record deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async getEmployeeStatistics(req, res, next) {
        try {
            const { employeeID, year, month } = req.params;
            const stats = await Attendance.getEmployeeStats(employeeID, year, month);
            res.json({
                success: true,
                data: stats,
                count: stats.length
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = attendanceController;