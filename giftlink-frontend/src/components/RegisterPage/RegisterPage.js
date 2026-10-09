import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const navigate = useNavigate();

const handleRegister = async () => {
    setError('');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (data.token) {
            sessionStorage.setItem('token', data.token);
        }

        navigate('/app');
    } catch (err) {
        setError(err.message || 'Unable to register. Please try again.');
    }
};

return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="register-card p-4 border rounded">
                    <h2 className="text-center mb-4 font-weight-bold">
                        Register
                    </h2>

                    <div className="mb-4">
                        <label htmlFor="firstName" className="form-label">
                            FirstName
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="form-label">
                            LastName
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
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
                        onClick={handleRegister}
                    >
                        Register
                    </button>

                    <p className="mt-4 text-center">
                        Already a member?{' '}
                        <a href="/app/login" className="text-primary">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

}

export default RegisterPage;
