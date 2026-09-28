import SessionCard from "./SessionCard";
import { type AddSession, type Session } from "../../types/sessions"
import type { Skill } from "../../types/skill";

type EditableListProps = {
    sessions: Session[];
    editable: true;
    skills: Skill[]
    onDelete: (id: number) => void;
    deleteError: string | null;
    onUpdate: (id: number, addSession: AddSession) => void;
    updateError: string | null;
}
type NonEditableListProps = {
    sessions: Session[];
    editable: false;
}
type SessionsListProps = EditableListProps | NonEditableListProps

function SessionsList(props: SessionsListProps) {
    const { sessions, editable } = props

    if (!editable) {
        return (
            <section className="sessions">
                <div className="cards">
                    <ul>
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                editable={editable}
                            />
                        ))}
                    </ul>
                </div>
            </section>
        )
    }

    const { skills, onDelete, deleteError, onUpdate, updateError } = props

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
                            editable={editable}
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