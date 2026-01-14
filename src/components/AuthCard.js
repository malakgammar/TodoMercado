import React, { useState } from 'react';
import Register from './Register'; 
import Login from './Login'; 
import './AuthCard.css'; 

const AuthCard = () => {
    const [isLogin, setIsLogin] = useState(true); 

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-card">
            <button className="btn btn-outline-danger btn-lg" onClick={toggleForm}>
                {isLogin ? 'Créer un compte' : 'Déjà un compte '}
            </button>
            {isLogin ? (
                <Login /> 
            ) : (
                <Register /> 
            )}
        </div>
    );
};

export default AuthCard;