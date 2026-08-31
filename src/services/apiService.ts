import type { ApiSession, Session } from "../types/sessions"

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