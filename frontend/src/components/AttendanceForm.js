import React, { useState } from 'react';
import { attendanceAPI } from '../services/api';
import '../styles/App.css';

const AttendanceForm = () => {
    const [formData, setFormData] = useState({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Validate form
            if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
                setMessage({ type: 'error', text: 'Please fill in all required fields' });
                setLoading(false);
                return;
            }

            const response = await attendanceAPI.markAttendance(formData);
            
            if (response.data.success) {
                setMessage({ 
                    type: 'success', 
                    text: `Attendance marked successfully for ${formData.employeeName}` 
                });
                // Reset form
                setFormData({
                    employeeName: '',
                    employeeID: '',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Present'
                });
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to mark attendance. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>
                Mark Employee Attendance
            </h2>
            
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="employeeName">
                        Employee Name *
                    </label>
                    <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        className="form-control"
                        value={formData.employeeName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="employeeID">
                        Employee ID *
                    </label>
                    <input
                        type="text"
                        id="employeeID"
                        name="employeeID"
                        className="form-control"
                        value={formData.employeeID}
                        onChange={handleChange}
                        placeholder="Enter employee ID"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="date">
                        Date *
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="status">
                        Attendance Status *
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="form-control select-control"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? <span className="loading"></span> : 'Mark Attendance'}
                </button>
            </form>
        </div>
    );
};

export default AttendanceForm;