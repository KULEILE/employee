import React, { useState } from 'react';
import { attendanceAPI } from '../services/api';
import '../styles/App.css';

const EmployeeStats = () => {
    const [statsData, setStatsData] = useState({
        employeeID: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setStatsData({
            ...statsData,
            [e.target.name]: e.target.value
        });
    };

    const getStats = async (e) => {
        e.preventDefault();
        if (!statsData.employeeID.trim()) {
            setMessage({ type: 'error', text: 'Please enter Employee ID' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await attendanceAPI.getEmployeeStats(
                statsData.employeeID, 
                statsData.year, 
                statsData.month
            );
            
            if (response.data.success) {
                setStats(response.data.data);
                if (response.data.data.length === 0) {
                    setMessage({ type: 'info', text: 'No attendance records found for the selected criteria' });
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to fetch statistics' 
            });
            setStats([]);
        } finally {
            setLoading(false);
        }
    };

    const getMonthName = (month) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    };

    return (
        <div className="employee-stats">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                Employee Monthly Statistics
            </h3>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={getStats} className="stats-form">
                <div className="form-group">
                    <label className="form-label">Employee ID *</label>
                    <input
                        type="text"
                        name="employeeID"
                        className="form-control"
                        value={statsData.employeeID}
                        onChange={handleChange}
                        placeholder="Enter employee ID"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Year</label>
                    <select
                        name="year"
                        className="form-control select-control"
                        value={statsData.year}
                        onChange={handleChange}
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Month</label>
                    <select
                        name="month"
                        className="form-control select-control"
                        value={statsData.month}
                        onChange={handleChange}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {getMonthName(i + 1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ alignSelf: 'end' }}>
                    <button 
                        type="submit" 
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        {loading ? <span className="loading"></span> : 'Get Statistics'}
                    </button>
                </div>
            </form>

            {stats.length > 0 && (
                <div className="week-stats">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>
                        Weekly Breakdown for {getMonthName(statsData.month)} {statsData.year}
                    </h4>
                    {stats.map((weekStat, index) => (
                        <div key={index} className="week-stat-card">
                            <h5 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                Week {weekStat.week}
                            </h5>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <div>
                                    <strong>Total Days:</strong> {weekStat.total_days}
                                </div>
                                <div style={{ color: 'var(--success-color)' }}>
                                    <strong>Present:</strong> {weekStat.present_days}
                                </div>
                                <div style={{ color: 'var(--danger-color)' }}>
                                    <strong>Absent:</strong> {weekStat.absent_days}
                                </div>
                                <div style={{ color: 'var(--warning-color)' }}>
                                    <strong>Attendance Rate:</strong>{' '}
                                    {((weekStat.present_days / weekStat.total_days) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeStats;