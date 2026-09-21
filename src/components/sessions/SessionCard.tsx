import type { Session } from "../../types/sessions"

type SessionCardProps = {
    session: Session;
    onDelete: (id: number) => void;
}

function SessionCard({ session, onDelete }: SessionCardProps) {
    return (
        <li className="session-card">
            <button
                onClick={() => onDelete(session.id)}
            >
                Delete
            </button>
            <p>Date: {new Date(session.date).toLocaleDateString()}</p>
            <p>Duration: {session.duration}</p>
            <p>Skill: {session.skill}</p>
            <p>Notes: {session.notes}</p>
        </li>
    )
}

export default SessionCard