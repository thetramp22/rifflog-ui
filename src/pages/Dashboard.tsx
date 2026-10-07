import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { type Statistic, type Stats } from "../types/statistics";
import Statistics from "../components/statistics/Statistics";
import { fetchStats } from "../services/apiService";
import { Grid, Stack, Typography } from "@mui/material";
import { formatDuration } from "../utils/formatDuration";
import SessionCard from "../components/sessions/SessionCard";
import { usePracticeSessions } from "../hooks/usePracticeSessions";
import { AuthenticationError } from "../errors/AuthenticationError";

const maxRecentSessions = 4

function Dashboard() {
    const { token, logout } = useAuth()

    const [stats, setStats] = useState<Stats | null>(null)
    const [isLoadingStats, setIsLoadingStats] = useState(true)
    const [statsError, setStatsError] = useState<string | null>(null)
    useEffect(() => {
        if (token === null) {
            return
        }
        const getStats = async () => {
            setIsLoadingStats(true)
            setStatsError(null)
            try {
                const stats: Stats = await fetchStats(token)
                setStats(stats)
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    logout()
                } else {
                    console.error(error)
                    setStatsError("Unexpected Error")
                }
            } finally {
                setIsLoadingStats(false)
            }
        }
        getStats()
    }, [token, logout])
    let statsDisplay

    if (isLoadingStats) {
        statsDisplay = (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                loading stats...
            </Typography>
        )
    } else if (statsError !== null) {
        statsDisplay = (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                Error loading stats
            </Typography>
        )
    } else if (stats !== null) {
        statsDisplay = (
            <Statistics statistics={statsToStatistics(stats)} />
        )
    }

    const { sessions, isLoadingSessions, sessionsError } = usePracticeSessions({ token, logout })
    let sessionsDisplay

    if (isLoadingSessions) {
        sessionsDisplay = (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                loading recent sessions...
            </Typography>
        )
    } else if (sessionsError !== null) {
        sessionsDisplay = (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
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
                {statsDisplay}
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
                ? stats.mostPracticedSkill.name + " for " + formatDuration(stats.mostPracticedSkill.totalMinutes)
                : "No sessions yet"
        },
        {
            name: "Longest Session",
            value: formatDuration(stats.longestSession)
        }
    ]
    return result
}

export default Dashboard