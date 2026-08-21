import { useState, type ReactNode } from "react"
import type { LoginResponse, User } from "../types/auth"
import AuthContext from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

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
    }

    function logout() {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}