import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="sidebar p-3 d-flex flex-column h-100">
            <h4 className="text-white mb-4 ps-3">
                <i className="fas fa-brain text-primary me-2"></i>
                FairHire
            </h4>

            <div className="mb-4 ps-3 text-secondary">
                <small>WELCOME, {user?.toUpperCase()}</small>
            </div>

            <nav className="nav flex-column flex-grow-1">
                <NavLink to="/overview" className="nav-link rounded mb-2">
                    <i className="fas fa-home w-25"></i> Overview
                </NavLink>
                <NavLink to="/data-studio" className="nav-link rounded mb-2">
                    <i className="fas fa-database w-25"></i> Data Studio
                </NavLink>
                <NavLink to="/audit" className="nav-link rounded mb-2">
                    <i className="fas fa-search-dollar w-25"></i> Bias Audit
                </NavLink>
                <NavLink to="/mitigation" className="nav-link rounded mb-2">
                    <i className="fas fa-shield-alt w-25"></i> Mitigation
                </NavLink>
                <NavLink to="/report" className="nav-link rounded mb-2">
                    <i className="fas fa-file-export w-25"></i> Export Report
                </NavLink>
            </nav>

            <button onClick={handleLogout} className="btn btn-outline-danger mt-auto w-100">
                <i className="fas fa-sign-out-alt me-2"></i> Logout
            </button>
        </div>
    );
};

export default Sidebar;
