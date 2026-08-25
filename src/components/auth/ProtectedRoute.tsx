import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
    const { user } = useAuth()

    if (user === null) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}

export default ProtectedRoute