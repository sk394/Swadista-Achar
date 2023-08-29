import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


const ProtectedRoute = ({isAuthenticated, children, adminRoute=false}) => {
    const {user}= useSelector(state => state.user);

    if(isAuthenticated === false){
        return <Navigate to="/login" />
    }

    if(adminRoute && user.role !== "admin"){
        return <Navigate to="/" />
    }
    return children ? children : <Outlet />;

 
}

export default ProtectedRoute;
