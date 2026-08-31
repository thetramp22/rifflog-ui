import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { type Session } from "../types/sessions"
import SessionsList from "../components/sessions/SessionsList"
import { authenticatedFetch, apiSessionsToSessions } from "../services/apiService"

function Sessions() {
    const { token } = useAuth()

    const [sessions, setSessions] = useState<Session[] | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getSessions = async () => {
            const response = await authenticatedFetch('https://api.rifflog.scottstarks.dev/api/practice-sessions', token, 'GET')

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            const sessions: Session[] = apiSessionsToSessions(data)
            setSessions(sessions)
        }
        getSessions()
    }, [token])
    return (
        <main className="sessions">
            <section className="heading">
                <h1>Sessions</h1>
            </section>
            {sessions !== null ? <SessionsList sessions={sessions} /> : <p>loading sessions...</p>}
        </main>
    )
}
export default Sessions