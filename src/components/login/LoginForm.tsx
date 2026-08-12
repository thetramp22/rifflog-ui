import React, { useState } from "react"

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://api.rifflog.scottstarks.dev/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Login successful!')
                console.log('Success:', data)
            } else {
                setMessage(data.message || 'Authentication failed')
            }
        } catch (error) {
            setMessage('Network error. Please try again later.')
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