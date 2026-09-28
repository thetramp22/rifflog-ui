import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { type Statistic, type Stats } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";
import { type Session } from "../types/sessions";
import { authenticatedFetch, apiSessionsToSessions, apiStatsToStats } from "../services/apiService";
import SessionsList from "../components/sessions/SessionsList";
import { Stack, Typography } from "@mui/material";

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
        <Stack spacing={4}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Dashboard
            </Typography>

            <Stack spacing={2}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Statistics
                </Typography>
                {stats !== null ?
                    <Statistics statistics={statsToStatistics(stats)} /> :
                    <Typography variant="body1">
                        loading statistics...
                    </Typography>
                }
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Recent Sessions
                </Typography>
                {sessions !== null ?
                    <SessionsList
                        sessions={sessions}
                        editable={false}
                    /> :
                    <Typography variant="body1">
                        loading recent sessions...
                    </Typography>}
            </Stack>
        </Stack>
    )
}

function statsToStatistics(stats: Stats) {
    const result: Statistic[] = [
        {
            name: "Total Practice Time",
            value: formatDuration(stats.totalMinutes)
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

function formatDuration(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    let hoursLabel = "hours"
    let minutesLabel = "minutes"

    if (hours === 0 && minutes === 0) {
        return "0 minutes"
    }

    if (hours === 1) {
        hoursLabel = "hour"
    }
    if (minutes === 1) {
        minutesLabel = "minute"
    }

    if (hours === 0) {
        return minutes + " " + minutesLabel
    }

    if (minutes === 0) {
        return hours + " " + hoursLabel
    }

    return String(hours) + " " + hoursLabel + " " + String(minutes) + " " + minutesLabel
}

export default Dashboard