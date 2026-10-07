import { AuthenticationError } from "../errors/AuthenticationError"
import { SkillsError } from "../errors/SkillsError"
import type { UserRegistrationData } from "../types/auth"
import type { AddSession, ApiAddSession, ApiSession, Session } from "../types/sessions"
import type { ApiStats, Stats } from "../types/statistics"

const API_URL = import.meta.env.VITE_API_URL

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
    if (response.status === 401) {
        throw new AuthenticationError()
    }
    return response
}

export async function fetchPracticeSessions(token: string) {
    const response = await authenticatedFetch(
        `${API_URL}/api/practice-sessions`,
        token,
        'GET')

    if (!response.ok) {
        throw new Error("Unable to load practice sessions")
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
    const response = await fetch(`${API_URL}/skills`, options)
    if (!response.ok) {
        throw new SkillsError()
    }
    return response
}

export async function fetchStats(token: string) {
    const response = await authenticatedFetch(
        `${API_URL}/api/practice-sessions/stats`,
        token,
        'GET'
    )

    if (!response.ok) {
        throw new Error("Unable to load practice stats")
    }

    const data = await response.json()
    const stats: Stats = apiStatsToStats(data)
    return stats
}

export async function createPracticeSession(addSession: AddSession, token: string) {
    const body: string = JSON.stringify(addSessionToApiAddSession(addSession))
    const response = await authenticatedFetch(
        `${API_URL}/api/practice-sessions`,
        token,
        "POST",
        body
    )
    return response
}

export async function deletePracticeSession(id: number, token: string) {
    const response = await authenticatedFetch(
        `${API_URL}/api/practice-sessions/` + id,
        token,
        "DELETE"
    )
    return response
}

export async function updatePracticeSession(id: number, addSession: AddSession, token: string) {
    const body: string = JSON.stringify(addSessionToApiAddSession(addSession))
    const response = await authenticatedFetch(
        `${API_URL}/api/practice-sessions/` + id,
        token,
        "PUT",
        body
    )
    return response
}

export async function registerUser(email: string, password: string) {
    const userData: UserRegistrationData = {
        email: email,
        password: password
    }
    const body: string = JSON.stringify(userData)
    const options: RequestInit = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }
    const response = await fetch(`${API_URL}/register`, options)
    if (!response.ok) {
        throw new Error('Could not register account')
    }
    return response
}

export function apiSessionsToSessions(apiSessions: ApiSession[]) {
    const result: Session[] = []
    for (const apiSession of apiSessions) {
        const session: Session = {
            id: apiSession.session_id,
            date: apiSession.practiced_at,
            duration: apiSession.duration_minutes,
            skillId: apiSession.skill_id,
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
    const localDateStr = addSession.practicedAt
    const [year, month, day] = localDateStr.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    const isoString: string = localDate.toISOString()
    const result: ApiAddSession = {
        skill_id: Number(addSession.skillId),
        duration_minutes: Number(addSession.durationMinutes),
        practiced_at: isoString,
        notes: addSession.notes
    }
    return result
}