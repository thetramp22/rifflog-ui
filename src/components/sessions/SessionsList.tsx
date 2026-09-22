import SessionCard from "./SessionCard";
import { type AddSession, type Session } from "../../types/sessions"
import type { Skill } from "../../types/skill";

type SessionListProps = {
    sessions: Session[];
    skills: Skill[]
    onDelete: (id: number) => void;
    deleteError: string | null;
    onUpdate: (id: number, addSession: AddSession) => void;
    updateError: string | null;
}

function SessionsList({ sessions, skills, onDelete, deleteError, onUpdate, updateError }: SessionListProps) {
    return (
        <section className="sessions">
            <div className="cards">
                {deleteError && (<p>{deleteError}</p>)}
                {updateError && (<p>{updateError}</p>)}
                <ul>
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            skills={skills}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default SessionsList