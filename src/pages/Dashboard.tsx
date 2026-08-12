import { useEffect, useState } from "react";
import RecentSessions from "../components/sessions/RecentSessions";
import Statistics from "../components/statistics/Statistics"

type Skill = {
    id: number;
    name: string;
    description: string;
}

type ApiMostPracticedSkill = {
    name: string;
    total_minutes: number;
}

type ApiStats = {
    total_minutes: number;
    total_sessions: number;
    most_practiced_skill: ApiMostPracticedSkill;
    longest_session: number;
}

type MostPracticedSkill = {
    name: string;
    totalMinutes: number;
}

type Stats = {
    totalMinutes: number;
    totalSessions: number;
    mostPracticedSkill: MostPracticedSkill;
    longestSession: number;
}

function Dashboard() {
    const [skills, setSkills] = useState<Skill[]>([])
    useEffect(() => {
        const getSkills = async () => {
            const response = await fetch('https://api.rifflog.scottstarks.dev/skills')
            const data = await response.json()
            setSkills(data)
        }
        getSkills();
    }, [])

    const [stats, setStats] = useState<Stats | null>(null)
    useEffect(() => {
        const getStats = async () => {
            const response = await fetch('https://api.rifflog.scottstarks.dev/api/practice-sessions/stats')

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            const stats: Stats = apiStatsToStats(data)
            setStats(stats)
        }
        getStats()
    }, [])

    const [statistics, setStatistics] = useState([
        { id: 1, name: "Total Practice Time", value: "12 hours" },
        { id: 2, name: "Total Sessions", value: "18" },
        { id: 3, name: "Most Practiced Skill", value: "Scales" },
        { id: 4, name: "Longest Session", value: "47 minutes" },
    ])
    const [sessions, setSessions] = useState([
        { id: 1, date: "2026-08-01T14:00:00Z", duration: 35, skill: "Scales", notes: "Major scales practice" },
        { id: 2, date: "2026-08-03T15:00:00Z", duration: 20, skill: "Chord Transitions", notes: "Simple Em-Am changes" },
        { id: 3, date: "2026-08-04T14:30:00Z", duration: 45, skill: "Scales", notes: "Long minor scales session" },
    ])

    return (
        <main className="dashboard">
            <section className="heading">
                <h1>Dashboard</h1>
                <h2>Welcome, Scott</h2>
            </section>
            <Statistics statistics={statistics} />
            <RecentSessions sessions={sessions} />
            <section>
                <ul>
                    {skills.map((skill) => (
                        <li key={skill.id}>
                            <p>id: {skill.id}</p>
                            <p>name: {skill.name}</p>
                            <p>description: {skill.description}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}

function apiStatsToStats(apiStats: ApiStats) {
    const result: Stats = {
        totalMinutes: apiStats.total_minutes,
        totalSessions: apiStats.total_sessions,
        mostPracticedSkill: {
            name: apiStats.most_practiced_skill.name,
            totalMinutes: apiStats.most_practiced_skill.total_minutes
        },
        longestSession: apiStats.longest_session
    }
    return result
}

export default Dashboard