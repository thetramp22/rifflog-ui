import { Stack, Typography, Button } from "@mui/material"
import RegisterForm from "../components/register/RegisterForm"
import { Link } from "react-router-dom"

function Register() {
    return (
        <Stack spacing={4}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Register
            </Typography>
            <RegisterForm />
            <Stack spacing={2}>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "center"
                    }}
                >
                    Already have an account?
                </Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to={"/"}
                    sx={{
                        maxWidth: 200,
                        alignSelf: "center"
                    }}
                >
                    Log in
                </Button>
            </Stack>
        </Stack>
    )
}

export default Register