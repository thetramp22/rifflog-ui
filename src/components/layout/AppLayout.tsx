import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { Container } from "@mui/material"

function AppLayout() {
    return (
        <>
            <Navbar />
            <Container>
                <Outlet />
            </Container>
        </>
    )
}

export default AppLayout