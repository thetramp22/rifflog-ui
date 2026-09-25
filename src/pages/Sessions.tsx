import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { type AddSession, type Session } from "../types/sessions"
import SessionsList from "../components/sessions/SessionsList"
import { fetchSkills, createPracticeSession, fetchPracticeSessions, deletePracticeSession, updatePracticeSession } from "../services/apiService"
import type { Skill } from "../types/skill"
import { AuthenticationError } from "../errors/AuthenticationError"
import { SkillsError } from "../errors/SkillsError"

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

    const [sessions, setSessions] = useState<Session[] | null>(null)
    const [isLoadingSessions, setIsLoadingSessions] = useState(true)
    const [sessionsError, setSessionsError] = useState<string | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getSessions = async () => {
            setIsLoadingSessions(true)
            setSessionsError(null)
            try {
                const sessions = await fetchPracticeSessions(token)
                setSessions(sessions)
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    logout()
                } else {
                    console.error(error)
                    setSessionsError("Unable to load sessions. Please try again later.")
                }
            } finally {
                setIsLoadingSessions(false)
            }
        }
        getSessions()
    }, [token, logout])

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
    const handleSelectedSkillChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
            if (token === null) {
                return
            }
            const response = await createPracticeSession(addSession, token)
            if (!response.ok) {
                setSubmitError("Unable to create session. Please try again.")
                return
            }

            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
            setFormSelectedSkill("")
            setFormDuration("")
            setFormDate(new Date().toISOString().split('T')[0])
            setFormNotes("")
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                console.error(error)
                setSessionsError(submitError)
            }
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

        if (token === null) {
            return
        }
        try {
            const response = await deletePracticeSession(idToDelete, token)
            if (!response.ok) {
                setDeleteError("Unable to delete session.")
                return
            }
            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                console.error(error)
                setSessionsError(deleteError)
            }
        }
    }

    const [updateError, setUpdateError] = useState<string | null>(null)

    const onUpdate = async (idToUpdate: number, addsession: AddSession) => {
        setUpdateError(null)

        if (token === null) {
            return
        }

        try {
            const response = await updatePracticeSession(idToUpdate, addsession, token)
            if (!response.ok) {
                setUpdateError("Unable to update session.")
                return
            }
            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                console.error(error)
                setSessionsError(updateError)
            }
        }
    }

    let sessionsDisplay

    if (isLoadingSessions === true || isLoadingSkills === true) {
        sessionsDisplay = <p>loading sessions...</p>
    } else if (sessionsError !== null) {
        sessionsDisplay = <p>{sessionsError}</p>
    } else if (skillsError !== null) {
        sessionsDisplay = <p>{skillsError}</p>
    } else if (sortedSessions !== null && skills !== null) {
        sessionsDisplay = <SessionsList
            sessions={sortedSessions}
            skills={skills}
            onDelete={onDelete}
            deleteError={deleteError}
            onUpdate={onUpdate}
            updateError={updateError}
        />
    }

    return (
        <main className="sessions">
            <section className="heading">
                <h1>Sessions</h1>
                <section>
                    <h2>Create new session</h2>
                </section>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="skill-select">Skill</label>
                    <select
                        id="skill-select"
                        value={formSelectedSkill}
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
                    <label htmlFor="duration-input">Duration</label>
                    <input
                        id="duration-input"
                        type="number"
                        value={formDuration}
                        onChange={handleDurationChange}
                        required
                        min={"1"}
                    />
                    <label htmlFor="date-input">Date</label>
                    <input
                        id="date-input"
                        type="date"
                        value={formDate}
                        onChange={handleDateChange}
                        required
                    />
                    <label htmlFor="notes-input">Notes</label>
                    <input
                        id="notes-input"
                        type="text"
                        value={formNotes}
                        onChange={handleNotesChange}
                    />
                    <button type="submit">{isSubmitting ? "Submitting..." : "Add Session"}</button>
                </form>
                {submitError && (<p>{submitError}</p>)}
            </section>

            <section>
                <h2>Sessions list</h2>
                <p>Sort by: </p>
                <select
                    value={sort.field}
                    onChange={(e) => setSort({ ...sort, field: e.target.value as SortField })}
                >
                    {SORT_FIELD_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <select
                    value={sort.direction}
                    onChange={(e) => setSort({ ...sort, direction: e.target.value as SortDirection })}
                >
                    {directionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {sessionsDisplay}
            </section>
        </main>
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