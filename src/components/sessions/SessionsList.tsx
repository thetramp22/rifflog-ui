import SessionCard from "./SessionCard";
import { type Session } from "../../types/sessions"

type SessionListProps = {
    sessions: Session[];
    onDelete: (id: number) => void;
    deleteError: string | null;

}

function SessionsList({ sessions, onDelete, deleteError }: SessionListProps) {
    return (
        <section className="sessions">
            <div className="cards">
                {deleteError && (<p>{deleteError}</p>)}
                <ul>
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default SessionsList