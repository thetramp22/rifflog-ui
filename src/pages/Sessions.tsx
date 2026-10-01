import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { type AddSession, type Session } from "../types/sessions"
import SessionsList from "../components/sessions/SessionsList"
import { fetchSkills } from "../services/apiService"
import type { Skill } from "../types/skill"
import { SkillsError } from "../errors/SkillsError"
import { usePracticeSessions } from "../hooks/usePracticeSessions"
import { TextField, FormControl, InputLabel, MenuItem, Select, Button, Stack, Typography, type SelectChangeEvent } from "@mui/material"

type SortField = "date" | "duration" | "skill"
type SortDirection = "ascending" | "descending"
type SortConfig = {
    field: SortField;
    direction: SortDirection;
}

const SORT_FIELD_OPTIONS = ['date', "duration", "skill"] as const;
const SORT_DIRECTION_BY_DATE = [
    { value: "ascending", label: "Oldest first" },
    { value: "descending", label: "Newest first" }
]
const SORT_DIRECTION_BY_DURATION = [
    { value: "ascending", label: "Shortest first" },
    { value: "descending", label: "Longest first" }
]
const SORT_DIRECTION_BY_SKILL = [
    { value: "ascending", label: "A → Z" },
    { value: "descending", label: "Z → A" }
]

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`)
}

function Sessions() {
    const { token, logout } = useAuth()

    const [sort, setSort] = useState<SortConfig>({
        field: "date",
        direction: "descending"
    })

    const {
        sessions,
        isLoadingSessions,
        sessionsError,
        createSession,
        deleteSession,
        updateSession
    } = usePracticeSessions({ token, logout })

    const [skills, setSkills] = useState<Skill[] | null>(null)
    const [isLoadingSkills, setIsLoadingSkills] = useState(true)
    const [skillsError, setSkillsError] = useState<string | null>(null)
    useEffect(() => {
        const getSkills = async () => {
            setIsLoadingSkills(true)
            setSkillsError(null)
            try {
                const response = await fetchSkills()
                const skills: Skill[] = await response.json()
                setSkills(skills)
            } catch (error) {
                if (error instanceof SkillsError) {
                    setSkillsError("Unable to load skills. Please try again later.")
                } else {
                    console.error(error)
                    setSkillsError("Unexpected Error")
                }
            } finally {
                setIsLoadingSkills(false)
            }
        }
        getSkills()
    }, [])

    const sortedSessions = sortSessions(sessions, sort)
    const directionOptions = getDirectionOptions(sort.field)

    const [formSelectedSkill, setFormSelectedSkill] = useState<string>("")
    const handleSelectedSkillChange = (event: SelectChangeEvent) => {
        setFormSelectedSkill(event.target.value)
    }
    const [formDuration, setFormDuration] = useState<string>("")
    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormDuration(event.target.value)
    }
    const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0])
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormDate(event.target.value)
    }
    const [formNotes, setFormNotes] = useState<string>("")
    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormNotes(event.target.value)
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const addSession: AddSession = {
                skillId: formSelectedSkill,
                durationMinutes: formDuration,
                practicedAt: formDate,
                notes: formNotes
            }
            await createSession(addSession)
            setFormSelectedSkill("")
            setFormDuration("")
            setFormDate(new Date().toISOString().split('T')[0])
            setFormNotes("")
        } catch (error) {
            console.error(error)
            setSubmitError("Error creating session")
        } finally {
            setIsSubmitting(false)
        }
    }

    const [deleteError, setDeleteError] = useState<string | null>(null)

    const onDelete = async (idToDelete: number) => {
        setDeleteError(null)

        const confirmed = window.confirm(
            "Are you sure you want to delete this session?"
        )

        if (!confirmed) {
            return
        }

        try {
            await deleteSession(idToDelete)
        } catch (error) {
            console.error(error)
            setDeleteError("Error deleting session")
        }
    }

    const [updateError, setUpdateError] = useState<string | null>(null)

    const onUpdate = async (idToUpdate: number, addSession: AddSession) => {
        setUpdateError(null)

        try {
            await updateSession(idToUpdate, addSession)
        } catch (error) {
            console.error(error)
            setUpdateError("Error updating session")
        }
    }

    let sessionsDisplay

    if (isLoadingSessions === true || isLoadingSkills === true) {
        sessionsDisplay = <Typography variant="body1">loading sessions...</Typography>
    } else if (sessionsError !== null) {
        sessionsDisplay = <Typography variant="body1">{sessionsError.message}</Typography>
    } else if (skillsError !== null) {
        sessionsDisplay = <Typography variant="body1">{skillsError}</Typography>
    } else if (sortedSessions !== null && skills !== null) {
        sessionsDisplay = <SessionsList
            sessions={sortedSessions}
            editable={true}
            skills={skills}
            onDelete={onDelete}
            deleteError={deleteError}
            onUpdate={onUpdate}
            updateError={updateError}
        />
    }

    return (
        <Stack spacing={4}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Sessions
            </Typography>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Create new session
                </Typography>
                <Stack
                    spacing={2}
                    component={"form"}
                    onSubmit={handleSubmit}
                    sx={{
                        maxWidth: 600,
                        width: "100%",
                        alignSelf: "center"
                    }}
                >
                    <FormControl fullWidth required>
                        <InputLabel id="select-skill-label">Skill</InputLabel>
                        <Select
                            labelId="select-skill-label"
                            id="select-skill"
                            value={formSelectedSkill}
                            label="Skill"
                            onChange={handleSelectedSkillChange}
                        >
                            {skills?.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Duration"
                        type="number"
                        value={formDuration}
                        onChange={handleDurationChange}
                        required
                        slotProps={{
                            htmlInput: {
                                min: 1,
                            }
                        }}
                    />
                    <TextField
                        label="Date"
                        type="date"
                        value={formDate}
                        onChange={handleDateChange}
                        required
                    />
                    <TextField
                        label="Notes"
                        value={formNotes}
                        onChange={handleNotesChange}
                    />
                    <Button variant="contained" type="submit">{isSubmitting ? "Submitting..." : "Add Session"}</Button>
                </Stack>
                {submitError && (<Typography variant="body1">{submitError}</Typography>)}
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Sessions List
                </Typography>
                <Stack
                    spacing={1}
                    direction={"row"}
                    sx={{ alignItems: "center" }}
                >
                    <Typography variant="body1">
                        Sort by:
                    </Typography>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="select-field-label">Field</InputLabel>
                        <Select
                            labelId="select-field-label"
                            id="select-field"
                            value={sort.field}
                            label="Field"
                            onChange={(e) => setSort({ ...sort, field: e.target.value as SortField })}
                        >
                            {SORT_FIELD_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="select-direction-label">Direction</InputLabel>
                        <Select
                            labelId="select-direction-label"
                            id="select-direction"
                            value={sort.direction}
                            label="Direction"
                            onChange={(e) => setSort({ ...sort, direction: e.target.value as SortDirection })}
                        >
                            {directionOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                {sessionsDisplay}
            </Stack>
        </Stack>
    )
}

function sortSessions(sessions: Session[] | null, sort: SortConfig) {
    if (sessions === null) {
        return null
    }
    const result = sessions.toSorted(getComparator(sort.field))
    if (sort.direction === "descending") {
        result.reverse()
    }
    return result
}

function getComparator(field: SortField) {
    switch (field) {
        case "date":
            return (a: Session, b: Session) =>
                a.date.localeCompare(b.date)

        case "duration":
            return (a: Session, b: Session) =>
                a.duration - b.duration

        case "skill":
            return (a: Session, b: Session) =>
                a.skill.localeCompare(b.skill)

        default:
            return assertNever(field)
    }
}

function getDirectionOptions(field: SortField) {
    switch (field) {
        case "date":
            return SORT_DIRECTION_BY_DATE
        case "duration":
            return SORT_DIRECTION_BY_DURATION
        case "skill":
            return SORT_DIRECTION_BY_SKILL

        default:
            return assertNever(field)
    }
}

export default Sessions