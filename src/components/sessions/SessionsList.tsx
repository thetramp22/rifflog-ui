import SessionCard from "./SessionCard";
import { type Session } from "../../types/sessions"

type SessionProps = {
    sessions: Session[];
}

function SessionsList({ sessions }: SessionProps) {
    return (
        <section className="sessions">
            <div className="cards">
                <ul>
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            date={session.date}
                            duration={session.duration}
                            skill={session.skill}
                            notes={session.notes}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default SessionsList