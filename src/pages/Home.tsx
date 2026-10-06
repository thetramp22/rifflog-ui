import { Box, Button, Stack, Typography } from "@mui/material"
import LoginForm from "../components/login/LoginForm"
import { Link } from "react-router-dom"

function Home() {
    return (
        <Stack spacing={4}>
            <Typography
                variant="h1"
                sx={{
                    alignSelf: "center"
                }}
            >
                RiffLog
            </Typography>
            <Box
                sx={{ backgroundColor: "primary.main" }}
            >
                <Stack
                    spacing={2}
                    sx={{ m: 10 }}
                >
                    <Typography
                        variant="h6"
                    >
                        Practice smarter.
                    </Typography>
                    <Typography
                        variant="h6"
                    >
                        Track your progress
                    </Typography>
                </Stack>
            </Box>
            <LoginForm />
            <Stack spacing={2}>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "center"
                    }}
                >
                    Don't have an account yet?
                </Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to={"/register"}
                    sx={{
                        maxWidth: 200,
                        alignSelf: "center"
                    }}
                >
                    Register
                </Button>
            </Stack>
        </Stack>
    )
}

export default Home