import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import DataStudio from './pages/DataStudio';
import BiasAudit from './pages/BiasAudit';
import Mitigation from './pages/Mitigation';
import Report from './pages/Report';

// Simple Auth Check (Demo)
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="/overview" />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="data-studio" element={<DataStudio />} />
                    <Route path="audit" element={<BiasAudit />} />
                    <Route path="mitigation" element={<Mitigation />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
