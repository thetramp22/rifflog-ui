import SessionCard from "./SessionCard";
import { type Session } from "../../types/sessions"

type SessionListProps = {
    sessions: Session[];
}

function SessionsList({ sessions }: SessionListProps) {
    return (
        <section className="sessions">
            <div className="cards">
                <ul>
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default SessionsList