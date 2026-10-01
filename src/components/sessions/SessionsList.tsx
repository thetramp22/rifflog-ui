import SessionCard from "./SessionCard";
import { type AddSession, type Session } from "../../types/sessions"
import type { Skill } from "../../types/skill";
import { Grid, Typography } from "@mui/material";

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
        <Grid
            container
            columnSpacing={2}
            rowSpacing={2}
            sx={{ alignItems: "stretch" }}
        >
            {deleteError && (
                <Grid size={12}>
                    <Typography variant="body1" align="center">{deleteError}</Typography>
                </Grid>
            )}
            {updateError && (
                <Grid size={12}>
                    <Typography variant="body1" align="center">{updateError}</Typography>
                </Grid>
            )}
            {sessions.map((session) => (
                <Grid key={session.id} size={{ xs: 12, md: 6 }}>
                    <SessionCard
                        session={session}
                        editable={editable}
                        skills={skills}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default SessionsList