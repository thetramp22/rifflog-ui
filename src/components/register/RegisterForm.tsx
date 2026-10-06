import React, { useState } from "react"
import { registerUser } from "../../services/apiService"
import { Stack, TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setMessage('')

        if (password !== confirmPassword) {
            setMessage('Passwords do not match!')
            setLoading(false)
            return
        }

        try {
            await registerUser(email, password)
            navigate('/')
        } catch (error) {
            setMessage('Registration failed')
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
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                    maxWidth: 400,
                    alignSelf: "center"
                }}
            >
                {loading ? 'Registering...' : 'Register'}
            </Button>
            {message && <p>{message}</p>}
        </Stack>
    )
}

export default RegisterForm