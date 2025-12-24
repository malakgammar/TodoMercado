import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Header, Acceuil, Footer } from './components/Acceuil';


const App = () => {
    return (
        <Router> 
            <AuthProvider> 
                <Header />
                <Routes>
                    <Route path="/" element={<Acceuil />} />
                    
                </Routes>
                <Footer />
            </AuthProvider>
        </Router>
    );
};

export default App;
