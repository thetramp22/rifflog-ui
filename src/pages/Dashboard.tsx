import { useEffect, useState } from "react";
import RecentSessions from "../components/sessions/RecentSessions"
import { useAuth } from "../hooks/useAuth";
import { type Statistic } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";
import { type Session } from "../types/sessions";

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

type ApiSession = {
    session_id: number;
    skill_id: number;
    skill_name: string;
    duration_minutes: number;
    notes: string;
    practiced_at: string;
    user_id: number;
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

const maxRecentSessions = 4


function Dashboard() {
    const { token } = useAuth()

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
            const stats: Stats = apiStatsToStats(data)
            setStats(stats)
        }
        getStats()
    }, [token])

    const [sessions, setSessions] = useState<Session[] | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getSessions = async () => {
            const config: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            const response = await fetch('https://api.rifflog.scottstarks.dev/api/practice-sessions', config)

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            console.log(data)
            const sessions: Session[] = apiSessionsToRecentSessions(data)
            console.log(sessions)
            setSessions(sessions)
        }
        getSessions()
    }, [token])

    return (
        <main className="dashboard">
            <section className="heading">
                <h1>Dashboard</h1>
                <h2>Welcome, Scott</h2>
            </section>
            {stats !== null ? <Statistics statistics={statsToStatistics(stats)} /> : <p>loading statistics...</p>}
            {sessions !== null ? <RecentSessions sessions={sessions} /> : <p>loading recent sessions...</p>}
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

function apiSessionsToRecentSessions(apiSessions: ApiSession[]) {
    const recentApisessions = apiSessions.slice(0, maxRecentSessions)
    const result: Session[] = []
    for (const apiSession of recentApisessions) {
        const session: Session = {
            id: apiSession.session_id,
            date: apiSession.practiced_at,
            duration: apiSession.duration_minutes,
            skill: apiSession.skill_name,
            notes: apiSession.notes
        }
        result.push(session)
    }
    return result
}

export default Dashboard