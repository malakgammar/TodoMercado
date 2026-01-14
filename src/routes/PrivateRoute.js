import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();
    
    return user ? <Outlet /> : <Navigate to="/authentification" />;
};

export default PrivateRoute;
