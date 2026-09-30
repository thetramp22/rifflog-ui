import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { type Statistic, type Stats } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";
import { authenticatedFetch, apiStatsToStats } from "../services/apiService";
import { Grid, Stack, Typography } from "@mui/material";
import { formatDuration } from "../utils/formatDuration";
import SessionCard from "../components/sessions/SessionCard";
import { usePracticeSessions } from "../hooks/usePracticeSessions";

const maxRecentSessions = 4

function Dashboard() {
    const { token, logout } = useAuth()

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

    const { sessions, isLoadingSessions, sessionsError } = usePracticeSessions({ token, logout })
    let sessionsDisplay

    if (isLoadingSessions) {
        sessionsDisplay = (
            <Typography variant="body1">
                loading recent sessions...
            </Typography>
        )
    } else if (sessionsError !== null) {
        sessionsDisplay = (
            <Typography variant="body1">
                Error loading sessions
            </Typography>
        )
    } else if (sessions !== null) {
        const recentSessions = sessions.slice(0, maxRecentSessions)
        sessionsDisplay = (
            <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={{
                    alignItems: "stretch"
                }}
            >
                {recentSessions.map((session) => (
                    <Grid key={session.id} size={{ xs: 12, md: 6 }}>
                        <SessionCard
                            session={session}
                            editable={false}
                        />
                    </Grid>
                ))}
            </Grid>
        )
    }

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
                {sessionsDisplay}
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

export default Dashboard