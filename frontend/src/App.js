import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
    const [activeTab, setActiveTab] = useState('form');

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo">AttendanceTracker</div>
                    <nav className="nav">
                        <button
                            className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
                            onClick={() => setActiveTab('form')}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            Mark Attendance
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            Dashboard
                        </button>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <h1 className="page-title">
                    Red Bat Employee Attendance Tracker
                </h1>
                
                {activeTab === 'form' ? <AttendanceForm /> : <AttendanceDashboard />}
            </main>

            <Footer />
        </div>
    );
}

export default App;