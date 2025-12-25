import 'aos/dist/aos.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header, Acceuil, Footer } from './components/Acceuil';


const App = () => {
    return (
        <Router>  
                <Header />
                <Routes>
                    <Route path="/" element={<Acceuil />} />
                    
                </Routes>
                <Footer />
        </Router>
    );
};

export default App;
