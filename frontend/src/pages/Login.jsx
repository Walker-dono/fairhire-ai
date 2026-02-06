import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        try {
            const res = await axios.post(endpoint, { username, password });
            if (!isRegister) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', res.data.username);
                navigate('/overview');
            } else {
                alert("Registered successfully! Please login.");
                setIsRegister(false);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'radial-gradient(circle at center, #23233e 0%, #1a1a2e 100%)' }}>
            <div className="glass-card p-5" style={{ width: '400px' }}>
                <h2 className="text-center mb-4 text-white">
                    <i className="fas fa-balance-scale me-2 text-primary"></i>
                    FairHire AI
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-light">Username</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-light">Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-white border-secondary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-neon w-100 mb-3">
                        {isRegister ? 'Register' : 'Login'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none text-muted"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Already have an account? Login' : 'Create an account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
