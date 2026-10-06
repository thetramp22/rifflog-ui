import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Stack, TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const { login } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            await login(email, password)
            navigate('/dashboard')
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
                    maxWidth: 200,
                    alignSelf: "center"
                }}
            >
                {loading ? 'Logging in...' : 'Log in'}
            </Button>
            {message && <p>{message}</p>}
        </Stack>
    )
}

export default LoginForm