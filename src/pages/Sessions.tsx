import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { type Session } from "../types/sessions"
import SessionsList from "../components/sessions/SessionsList"
import { authenticatedFetch, apiSessionsToSessions } from "../services/apiService"

type SortField = "date" | "duration" | "skill"
type SortDirection = "ascending" | "descending"
type SortConfig = {
    field: SortField;
    direction: SortDirection;
}

const SORT_FIELD_OPTIONS = ['date', "duration", "skill"] as const;

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`)
}

function Sessions() {
    const { token } = useAuth()

    const [sort, setSort] = useState<SortConfig>({
        field: "date",
        direction: "descending"
    })

    const [sessions, setSessions] = useState<Session[] | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getSessions = async () => {
            const response = await authenticatedFetch('https://api.rifflog.scottstarks.dev/api/practice-sessions', token, 'GET')

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            const sessions: Session[] = apiSessionsToSessions(data)
            setSessions(sessions)
        }
        getSessions()
    }, [token])

    const sortedSessions = sortSessions(sessions, sort)

    return (
        <main className="sessions">
            <section className="heading">
                <h1>Sessions</h1>
            </section>
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
            {sortedSessions !== null ? <SessionsList sessions={sortedSessions} /> : <p>loading sessions...</p>}
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

export default Sessions