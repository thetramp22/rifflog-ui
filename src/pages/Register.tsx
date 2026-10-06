import { Stack, Typography } from "@mui/material"
import RegisterForm from "../components/register/RegisterForm"

function Register() {
    return (
        <Stack spacing={4}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Register
            </Typography>
            <RegisterForm />
        </Stack>
    )
}

export default Register