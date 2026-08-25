import { useState, type ReactNode } from "react"
import type { LoginResponse, User } from "../types/auth"
import AuthContext from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(() => {
        const storedUserString = localStorage.getItem("user")
        if (storedUserString === null) {
            return null
        }
        try {
            const storedUser: User = JSON.parse(storedUserString)
            return storedUser
        } catch (error) {
            console.error("Failed to parse JSON string:", error)
            return null
        }
    })
    const [token, setToken] = useState(() => localStorage.getItem("token"))

    async function login(email: string, password: string) {
        const response = await fetch('https://api.rifflog.scottstarks.dev/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            throw new Error("Authentication failed")
        }

        const loginResponse: LoginResponse = await response.json()
        setToken(loginResponse.token)
        setUser(loginResponse.user)
        localStorage.setItem("token", loginResponse.token)
        localStorage.setItem("user", JSON.stringify(loginResponse.user))
    }

    function logout() {
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}