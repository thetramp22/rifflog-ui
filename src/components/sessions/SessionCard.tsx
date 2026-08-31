import type { Session } from "../../types/sessions"

type SessionCardProps = {
    session: Session
}

function SessionCard({ session }: SessionCardProps) {
    return (
        <li className="session-card">
            <p>Date: {new Date(session.date).toLocaleDateString()}</p>
            <p>Duration: {session.duration}</p>
            <p>Skill: {session.skill}</p>
            <p>Notes: {session.notes}</p>
        </li>
    )
}

export default SessionCard