import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import EmployeeStats from './EmployeeStats';
import '../styles/App.css';

const AttendanceDashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        filterAttendance();
    }, [attendance, searchQuery, dateFilter]);

    const fetchAttendance = async () => {
        try {
            const response = await attendanceAPI.getAllAttendance();
            if (response.data.success) {
                setAttendance(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setMessage({ 
                type: 'error', 
                text: 'Failed to load attendance records' 
            });
        } finally {
            setLoading(false);
        }
    };

    const filterAttendance = () => {
        let filtered = attendance;

        if (searchQuery) {
            filtered = filtered.filter(record =>
                record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.employeeID.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(record => record.date === dateFilter);
        }

        setFilteredAttendance(filtered);
    };

    const handleDelete = async (id, employeeName) => {
        if (window.confirm(`Are you sure you want to delete attendance record for ${employeeName}?`)) {
            try {
                const response = await attendanceAPI.deleteAttendance(id);
                if (response.data.success) {
                    setMessage({ 
                        type: 'success', 
                        text: 'Attendance record deleted successfully' 
                    });
                    fetchAttendance(); // Refresh the list
                }
            } catch (error) {
                console.error('Error deleting attendance:', error);
                setMessage({ 
                    type: 'error', 
                    text: error.response?.data?.message || 'Failed to delete record' 
                });
            }
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setDateFilter('');
    };

    const getStatusBadge = (status) => {
        return (
            <span className={`status-badge status-${status.toLowerCase()}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="card text-center">
                <div className="loading" style={{ margin: '2rem auto' }}></div>
                <p>Loading attendance records...</p>
            </div>
        );
    }

    return (
        <div>
            <EmployeeStats />

            <div className="card">
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                    Attendance Records Dashboard
                </h2>

                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="search-filter-container">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by employee name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-select">
                        <input
                            type="date"
                            className="form-control"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    <button 
                        className="btn btn-secondary"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{attendance.length}</div>
                        <div className="stat-label">Total Records</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {attendance.filter(a => a.status === 'Present').length}
                        </div>
                        <div className="stat-label">Present Days</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {attendance.filter(a => a.status === 'Absent').length}
                        </div>
                        <div className="stat-label">Absent Days</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {new Set(attendance.map(a => a.employeeID)).size}
                        </div>
                        <div className="stat-label">Unique Employees</div>
                    </div>
                </div>

                <div className="table-container">
                    {filteredAttendance.length === 0 ? (
                        <div className="text-center" style={{ padding: '2rem' }}>
                            <p>No attendance records found.</p>
                            {(searchQuery || dateFilter) && (
                                <button 
                                    className="btn btn-primary mt-3"
                                    onClick={clearFilters}
                                >
                                    Clear Filters to View All Records
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Employee ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Recorded At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.employeeName}</td>
                                        <td>{record.employeeID}</td>
                                        <td>{record.formatted_date}</td>
                                        <td>{getStatusBadge(record.status)}</td>
                                        <td>{record.recorded_at}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(record.id, record.employeeName)}
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="text-center mt-3">
                    <p>
                        Showing {filteredAttendance.length} of {attendance.length} records
                        {(searchQuery || dateFilter) && ' (filtered)'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;