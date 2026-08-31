import { useEffect, useState } from "react";
import RecentSessions from "../components/sessions/RecentSessions"
import { useAuth } from "../hooks/useAuth";
import { type Statistic, type Stats, type ApiStats } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";
import { type Session } from "../types/sessions";
import { authenticatedFetch, apiSessionsToSessions } from "../services/apiService";

const maxRecentSessions = 4

function Dashboard() {
    const { token } = useAuth()

    const [stats, setStats] = useState<Stats | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getStats = async () => {
            const response = await authenticatedFetch('https://api.rifflog.scottstarks.dev/api/practice-sessions/stats', token, 'GET')

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
            const response = await authenticatedFetch('https://api.rifflog.scottstarks.dev/api/practice-sessions', token, 'GET')

            if (!response.ok) {
                console.log("User is not Authorized")
                return
            }

            const data = await response.json()
            const sessions: Session[] = apiSessionsToSessions(data)
            const recentSessions = sessions.slice(0, maxRecentSessions)
            setSessions(recentSessions)
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

export default Dashboard