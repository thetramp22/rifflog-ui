type SessionCardProps = {
    date: string,
    duration: number,
    skill: string,
    notes: string
}

function SessionCard({ date, duration, skill, notes }: SessionCardProps) {
    return (
        <li className="session-card">
            <p>Date: {new Date(date).toLocaleDateString()}</p>
            <p>Duration: {duration}</p>
            <p>Skill: {skill}</p>
            <p>Notes: {notes}</p>
        </li>
    )
}

export default SessionCard