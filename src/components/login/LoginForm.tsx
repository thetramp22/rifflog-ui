import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Stack, TextField, Button } from "@mui/material"

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const { login } = useAuth()

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);
        setMessage('');

        try {
            await login(email, password)
            setMessage('Login successful!')
        } catch (error) {
            setMessage('Authentication failed')
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Stack
            spacing={2}
            component={"form"}
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                width: "100%",
                alignSelf: "center"
            }}
        >
            <TextField
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                    maxWidth: 300,
                    alignSelf: "center"
                }}
            >
                {loading ? 'Logging in...' : 'Submit'}
            </Button>
            {message && <p>{message}</p>}
        </Stack>
    )
}

export default LoginForm