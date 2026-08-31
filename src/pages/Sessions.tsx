import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { type ApiSession, type Session } from "../types/sessions"
import SessionsList from "../components/sessions/SessionsList"
import authenticatedFetch from "../services/apiService"

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

function apiSessionsToSessions(apiSessions: ApiSession[]) {
    const result: Session[] = []
    for (const apiSession of apiSessions) {
        const session: Session = {
            id: apiSession.session_id,
            date: apiSession.practiced_at,
            duration: apiSession.duration_minutes,
            skill: apiSession.skill_name,
            notes: apiSession.notes
        }
        result.push(session)
    }
    return result
}

export default Sessions