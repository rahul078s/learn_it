import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);

    // If there is no user in our global memory, redirect them
    if (!user) {
        return <Navigate to="/login" replace />
    }
    // If a user is Logged in, render the component normally
    return children;
}