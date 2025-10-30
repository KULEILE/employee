import React from 'react';
import '../styles/App.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="#privacy" className="footer-link">Privacy Policy</a>
                    <a href="#terms" className="footer-link">Terms of Service</a>
                    <a href="#contact" className="footer-link">Contact Support</a>
                    <a href="#help" className="footer-link">Help Center</a>
                </div>
                <div className="footer-text">
                    <p>&copy; {currentYear} Employee Attendance Tracker. Faculty of Information & Communication Technology.</p>
                    <p>BSc. in Information Technology - Limkokwing University of Creative Technology</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;