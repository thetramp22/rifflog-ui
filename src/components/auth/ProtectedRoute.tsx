import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
    const { user, token } = useAuth()

    if (user === null || token === null) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default ProtectedRoute