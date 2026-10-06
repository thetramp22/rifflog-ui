import { useAuth } from '../../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link, Button, Stack, Container } from '@mui/material';

function Navbar() {
    const { user, logout } = useAuth()

    const authenticatedNavigationItems = [
        { id: 2, name: "Dashboard", url: "/dashboard" },
        { id: 3, name: "Sessions", url: "/sessions" }
    ]

    const unauthenticatedNavigationItems = [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Login", url: "/login" }
    ]

    const navigationItems = user !== null ? authenticatedNavigationItems : unauthenticatedNavigationItems

    const handleClick = () => {
        logout()
    }

    return (
        <Container>
            <Stack
                component="section"
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography variant='h1'>
                    RiffLog
                </Typography>
                <Stack direction={'row'} spacing={3}>
                    {navigationItems.map((item) => (
                        <Link
                            key={item.id}
                            component={RouterLink}
                            to={item.url}
                            underline='none'
                            sx={{
                                color: "text.primary",
                                "&:hover": {
                                    color: "secondary.main"
                                }
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </Stack>
                {user !== null ?
                    <Stack direction={'row'} spacing={2}>
                        <Typography variant='body1'>{user.email}</Typography>
                        <Button variant="contained" onClick={handleClick}>Logout</Button>
                    </Stack> :
                    <Box>
                        <Typography variant='body1'>Not logged in</Typography>
                    </Box>
                }
            </Stack>
        </Container>
    )
}

export default Navbar