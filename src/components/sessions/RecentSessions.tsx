import SessionCard from "./SessionCard";

type Session = {
    id: number;
    date: string;
    duration: number;
    skill: string;
    notes: string;
}

type SessionProps = {
    sessions: Session[];
}

function RecentSessions({ sessions }: SessionProps) {
    return (
        <section className="sessions">
            <div className="heading">
                <h2>Recent Sessions</h2>
            </div>
            <div className="cards">
                <ul>
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            date={session.date}
                            duration={session.duration}
                            skill={session.skill}
                            notes={session.notes}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default RecentSessions