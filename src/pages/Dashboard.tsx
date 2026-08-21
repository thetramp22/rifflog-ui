import { useEffect, useState } from "react";
import RecentSessions from "../components/sessions/RecentSessions"
import { useAuth } from "../hooks/useAuth";
import { type Statistic } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";

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
    most_practiced_skill: ApiMostPracticedSkill | null;
    longest_session: number;
}

type MostPracticedSkill = {
    name: string;
    totalMinutes: number;
}

type Stats = {
    totalMinutes: number;
    totalSessions: number;
    mostPracticedSkill: MostPracticedSkill | null;
    longestSession: number;
}

function Dashboard() {
    const { token } = useAuth()

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
        if (token === null) {
            return
        }
        const getStats = async () => {
            const config: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            const response = await fetch('https://api.rifflog.scottstarks.dev/api/practice-sessions/stats', config)

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            console.log(data)
            const stats: Stats = apiStatsToStats(data)
            setStats(stats)
        }
        getStats()
    }, [token])

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
            {stats !== null ? <Statistics statistics={statsToStatistics(stats)} /> : <p>loading statistics...</p>}

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
        mostPracticedSkill: apiStats.most_practiced_skill
            ? {
                name: apiStats.most_practiced_skill.name,
                totalMinutes: apiStats.most_practiced_skill.total_minutes
            }
            : null,
        longestSession: apiStats.longest_session
    }
    return result
}

function statsToStatistics(stats: Stats) {
    const result: Statistic[] = [
        {
            name: "Total Practice Time",
            value: String(stats.totalMinutes / 60) + " hours"
        },
        {
            name: "Total Sessions",
            value: String(stats.totalSessions)
        },
        {
            name: "Most Practiced Skill",
            value: stats.mostPracticedSkill
                ? stats.mostPracticedSkill.name + " for " + stats.mostPracticedSkill.totalMinutes + " minutes"
                : "No sessions yet"
        },
        {
            name: "Longest Session",
            value: String(stats.longestSession) + " minutes"
        }
    ]
    return result
}

export default Dashboard