import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const navigate = useNavigate();

const handleLogin = async () => {
    setError('');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (data.token) {
            sessionStorage.setItem('token', data.token);
        }

        navigate('/app');
    } catch (err) {
        setError(err.message || 'Unable to login. Please try again.');
    }
};

return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="login-card p-4 border rounded">
                    <h2 className="text-center mb-4 font-weight-bold">
                        Login
                    </h2>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-danger" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-primary w-100 mb-3"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                    <p className="mt-4 text-center">
                        New here?{' '}
                        <a href="/app/register" className="text-primary">
                            Register Here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

}

export default LoginPage;
