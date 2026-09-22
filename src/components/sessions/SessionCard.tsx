import React, { useState } from "react";
import type { AddSession, Session } from "../../types/sessions"
import type { Skill } from "../../types/skill";

type SessionCardProps = {
    session: Session;
    skills: Skill[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, addSession: AddSession) => void;
}

function SessionCard({ session, skills, onDelete, onUpdate }: SessionCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editSkillId, setEditSkillId] = useState<string>(String(session.skillId))
    const handleSelectedSkillChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEditSkillId(event.target.value)
    }
    const [editDuration, setEditDuration] = useState<string>(String(session.duration))
    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditDuration(event.target.value)
    }
    const [editDate, setEditDate] = useState<string>(isoDateToDateInputValue(session.date))
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditDate(event.target.value)
    }
    const [editNotes, setEditNotes] = useState<string>(session.notes)
    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditNotes(event.target.value)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditSkillId(String(session.skillId))
        setEditDuration(String(session.duration))
        setEditDate(isoDateToDateInputValue(session.date))
        setEditNotes(session.notes)
    }

    const handleSave = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const addSession: AddSession = {
            skillId: editSkillId,
            durationMinutes: editDuration,
            practicedAt: editDate,
            notes: editNotes
        }

        setIsEditing(false)
        onUpdate(session.id, addSession)
    }
    return (
        <li className="session-card">
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <label htmlFor={`edit-date-input-${session.id}`}>Date</label>
                    <input
                        id={`edit-date-input-${session.id}`}
                        type="date"
                        value={editDate}
                        onChange={handleDateChange}
                        required
                    />
                    <label htmlFor={`edit-duration-input-${session.id}`}>Duration</label>
                    <input
                        id={`edit-duration-input-${session.id}`}
                        type="number"
                        value={editDuration}
                        onChange={handleDurationChange}
                        required
                    />
                    <label htmlFor={`edit-skill-select-${session.id}`}>Skill</label>
                    <select
                        id={`edit-skill-select-${session.id}`}
                        value={editSkillId}
                        onChange={handleSelectedSkillChange}
                        required
                    >
                        <option value="">Select a skill...</option>
                        {skills?.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor={`edit-notes-input-${session.id}`}>Notes</label>
                    <input
                        id={`edit-notes-input-${session.id}`}
                        type="text"
                        value={editNotes}
                        onChange={handleNotesChange}
                    />
                    <button type="submit">
                        Save
                    </button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button
                        onClick={() => onDelete(session.id)}
                    >
                        Delete
                    </button>
                    <p>Date: {new Date(session.date).toLocaleDateString()}</p>
                    <p>Duration: {session.duration}</p>
                    <p>Skill: {session.skill}</p>
                    <p>Notes: {session.notes}</p>
                </div>
            )}
        </li>
    )
}

function isoDateToDateInputValue(isoStr: string) {
    const date = new Date(isoStr)

    const localDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date)

    return localDate
}

export default SessionCard