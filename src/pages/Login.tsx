import LoginForm from "../components/login/LoginForm"
import { Stack, Typography } from "@mui/material"

function Login() {
    return (
        <Stack spacing={4}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Login
            </Typography>
            <LoginForm />
        </Stack>
    )
}

export default Login