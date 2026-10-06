import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { Container } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"

function AppLayout() {
    const { user, token } = useAuth()

    return (
        <>
            {user !== null && token !== null && <Navbar />}
            <Container>
                <Outlet />
            </Container>
        </>
    )
}

export default AppLayout