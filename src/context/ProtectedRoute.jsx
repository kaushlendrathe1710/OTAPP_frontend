import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from './authContext';
import { LoginAdmin } from "../pages/LoginAdmin";
import { LoginStudent } from "../pages/LoginStudent";
import { LoginTutor } from "../pages/LoginTutor";
import userContext from "./userContext";

const ProtectedRoute = ({ children, path, userType }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { userData } = useContext(userContext);
    const navigate = useNavigate();
    // const [requestedUrl, setRequestedUrl] = useState("");

    useEffect(() => {
        // setRequestedUrl(window.location.pathname);
        localStorage.setItem("requestedUrl", window.location.pathname);

        if (userData) {
            setIsAuthenticated(true);
        }
    }, [userData]);

    if (isAuthenticated && userData.userType == userType) {
        return <div>{children}</div>;
    } else {
        if (userType == "Admin" || userType === "Co-Admin" || userType === "Sub-Admin" || userType === "Super-Admin") {
            return <LoginAdmin />;
        } else if (userType == "Student") {
            return <LoginStudent />;
        } else if (userType == "Tutor") {
            return <LoginTutor />;
        }
    }
};

export default ProtectedRoute;
