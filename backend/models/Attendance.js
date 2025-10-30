const pool = require('../config/database');

class Attendance {
    static async create(attendanceData) {
        const { employeeName, employeeID, date, status } = attendanceData;
        const [result] = await pool.execute(
            'INSERT INTO attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)',
            [employeeName, employeeID, date, status]
        );
        return result;
    }

    static async getAll() {
        const [rows] = await pool.execute(`
            SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as formatted_date,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as recorded_at
            FROM attendance 
            ORDER BY date DESC, created_at DESC
        `);
        return rows;
    }

    static async getByEmployeeId(employeeID) {
        const [rows] = await pool.execute(
            'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as formatted_date FROM attendance WHERE employeeID = ? ORDER BY date DESC',
            [employeeID]
        );
        return rows;
    }

    static async getByDate(date) {
        const [rows] = await pool.execute(
            'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as formatted_date FROM attendance WHERE date = ? ORDER BY employeeName',
            [date]
        );
        return rows;
    }

    static async search(query) {
        const [rows] = await pool.execute(
            `SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as formatted_date 
             FROM attendance 
             WHERE employeeName LIKE ? OR employeeID LIKE ? 
             ORDER BY date DESC`,
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    }

    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM attendance WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getEmployeeStats(employeeID, year, month) {
        const [rows] = await pool.execute(`
            SELECT 
                YEAR(date) as year,
                MONTH(date) as month,
                WEEK(date) as week,
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days
            FROM attendance 
            WHERE employeeID = ? AND YEAR(date) = ? AND MONTH(date) = ?
            GROUP BY YEAR(date), MONTH(date), WEEK(date)
            ORDER BY year, month, week
        `, [employeeID, year, month]);
        return rows;
    }
}

module.exports = Attendance;