import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"

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
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>
                <div>
                    <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Submit'}</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default LoginForm