import React, { useState } from "react";
import type { AddSession, Session } from "../../types/sessions"
import type { Skill } from "../../types/skill"
import { Card, CardContent, Stack, Typography, Button, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField } from "@mui/material";
import { formatDuration } from "../../utils/formatDuration";


type EditableCardProps = {
    session: Session;
    editable: true;
    skills: Skill[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, addSession: AddSession) => void;
}
type NonEditableCardProps = {
    session: Session;
    editable: false;
}
type SessionCardProps = EditableCardProps | NonEditableCardProps

function SessionCard(props: SessionCardProps) {
    const { session } = props


    const [isEditing, setIsEditing] = useState(false)
    const [editSkillId, setEditSkillId] = useState<string>(String(session.skillId))
    const handleSelectedSkillChange = (event: SelectChangeEvent) => {
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

    if (!props.editable) {
        return (
            <Card sx={{
                borderRadius: 4,
                boxShadow: 2,
                height: "100%"
            }}>
                <Stack
                    direction={"row"}
                    sx={{
                        backgroundColor: "primary.main",
                        justifyContent: "space-between",
                        p: 1,
                        pl: 2
                    }}
                >
                    <Typography variant="h6">
                        {session.skill}
                    </Typography>
                    <Typography variant="h6">
                        {formatDuration(session.duration)}
                    </Typography>
                </Stack>
                <CardContent>
                    <Typography variant="body1">
                        {new Date(session.date).toLocaleDateString()}
                    </Typography>
                    {session.notes !== "" && <Typography variant="body1">
                        {session.notes}
                    </Typography>}
                </CardContent>
            </Card>
        )
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
        props.onUpdate(session.id, addSession)
    }
    return (
        <Card sx={{
            borderRadius: 4,
            boxShadow: 2,
            height: "100%"
        }}>
            {isEditing ? (
                <Stack
                    component={"form"}
                    onSubmit={handleSave}
                >
                    <Stack
                        direction={"row"}
                        sx={{
                            backgroundColor: "primary.main",
                            justifyContent: "space-between",
                            p: 1,
                            pl: 2
                        }}
                    >
                        <FormControl
                            size="small"
                            required
                        >
                            <InputLabel id={`edit-skill-select-label-${session.id}`}>Skill</InputLabel>
                            <Select
                                labelId={`edit-skill-select-label-${session.id}`}
                                id={`edit-skill-select-${session.id}`}
                                value={editSkillId}
                                label="Skill"
                                onChange={handleSelectedSkillChange}
                            >
                                {props.skills.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Duration"
                            type="number"
                            size="small"
                            value={editDuration}
                            onChange={handleDurationChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                }
                            }}
                        />
                    </Stack>
                    <Stack
                        spacing={1}
                        sx={{
                            justifyContent: "space-between",
                            p: 1,
                            pl: 2
                        }}
                    >
                        <TextField
                            label="Date"
                            type="date"
                            size="small"
                            value={editDate}
                            onChange={handleDateChange}
                            required
                        />
                        <TextField
                            label="Notes"
                            value={editNotes}
                            onChange={handleNotesChange}
                        />
                        <Stack
                            spacing={1}
                            direction={"row"}
                            sx={{ justifyContent: "right" }}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Save
                            </Button>
                        </Stack>
                    </Stack>

                </Stack>
            ) : (
                <Stack>
                    <Stack
                        direction={"row"}
                        sx={{
                            backgroundColor: "primary.main",
                            justifyContent: "space-between",
                            p: 1,
                            pl: 2
                        }}
                    >
                        <Typography variant="h6">
                            {session.skill}
                        </Typography>
                        <Typography variant="h6">
                            {formatDuration(session.duration)}
                        </Typography>
                    </Stack>
                    <CardContent>
                        <Typography variant="body1">
                            {new Date(session.date).toLocaleDateString()}
                        </Typography>
                        {session.notes !== "" && <Typography variant="body1">
                            {session.notes}
                        </Typography>}
                        <Stack direction={"row"} spacing={1} sx={{ justifyContent: "right" }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => props.onDelete(session.id)}
                            >
                                Delete
                            </Button>
                        </Stack>

                    </CardContent>
                </Stack>
            )}
        </Card>
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