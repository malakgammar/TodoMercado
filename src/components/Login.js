import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);

        if (!error) {
            navigate('/profile');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleSubmit}>
                <h3 className="mb-4 text-center">Connexion </h3>

                {error && <p className="text-danger">{error}</p>}

                <div className="mb-3">
                    <label className="form-label">Email </label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mot de passe </label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Connexion...' : 'Se connecter '}
                </button>
            </form>
        </div>
    );
};

export default Login;
