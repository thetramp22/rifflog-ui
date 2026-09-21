import type { AddSession, ApiAddSession, ApiSession, Session } from "../types/sessions"
import type { ApiStats, Stats } from "../types/statistics"

export async function authenticatedFetch(url: string, token: string, method: string, body?: string) {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        ...(body !== undefined && { body: body })
    }
    const response = await fetch(url, options)
    return response
}

export async function fetchPracticeSessions(token: string) {
    const response = await authenticatedFetch(
        'https://api.rifflog.scottstarks.dev/api/practice-sessions',
        token,
        'GET')

    if (!response.ok) {
        console.log("User is not Authorized")
        return null
    }

    const data = await response.json()
    const sessions: Session[] = apiSessionsToSessions(data)
    return sessions
}

export async function fetchSkills() {
    const options: RequestInit = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch("https://api.rifflog.scottstarks.dev/skills", options)
    return response
}

export async function createPracticeSession(addSession: AddSession, token: string) {
    const body: string = JSON.stringify(addSessionToApiAddSession(addSession))
    console.log("body", body)
    const response = await authenticatedFetch(
        "https://api.rifflog.scottstarks.dev/api/practice-sessions",
        token,
        "POST",
        body
    )
    return response
}

export async function deletePracticeSession(id: number, token: string) {
    const response = await authenticatedFetch(
        "https://api.rifflog.scottstarks.dev/api/practice-sessions/" + id,
        token,
        "DELETE"
    )
    return response
}

export function apiSessionsToSessions(apiSessions: ApiSession[]) {
    const result: Session[] = []
    for (const apiSession of apiSessions) {
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

export function apiStatsToStats(apiStats: ApiStats) {
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

export function addSessionToApiAddSession(addSession: AddSession) {
    const dateObject: Date = new Date(addSession.practicedAt)
    const isoString: string = dateObject.toISOString()
    const result: ApiAddSession = {
        skill_id: Number(addSession.skillId),
        duration_minutes: Number(addSession.durationMinutes),
        practiced_at: isoString,
        notes: addSession.notes
    }
    return result
}