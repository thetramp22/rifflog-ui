import { useEffect, useState } from "react";
import type { AddSession, Session } from "../types/sessions";
import { createPracticeSession, deletePracticeSession, fetchPracticeSessions, updatePracticeSession } from "../services/apiService";
import { AuthenticationError } from "../errors/AuthenticationError";

interface UsePracticeSessionsProps {
    token: string | null;
    logout: () => void;
}

export function usePracticeSessions({ token, logout }: UsePracticeSessionsProps) {
    const [sessions, setSessions] = useState<Session[] | null>(null)
    const [isLoadingSessions, setIsLoadingSessions] = useState(true)
    const [sessionsError, setSessionsError] = useState<Error | null>(null)

    useEffect(() => {
        if (token === null) {
            return
        }
        const getSessions = async () => {
            setIsLoadingSessions(true)
            setSessionsError(null)

            try {
                const sessions = await fetchPracticeSessions(token)
                setSessions(sessions)
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    logout()
                } else if (error instanceof Error) {
                    setSessionsError(error)
                }
            } finally {
                setIsLoadingSessions(false)
            }
        }
        getSessions()
    }, [token, logout])

    async function createSession(addSession: AddSession) {
        if (token === null) {
            return
        }
        try {
            const response = await createPracticeSession(addSession, token)
            if (!response.ok) {
                throw new Error("Unable to create session. Please try again.")
            }

            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                throw error
            }
        }
    }

    async function deleteSession(idToDelete: number) {
        if (token === null) {
            return
        }
        try {
            const response = await deletePracticeSession(idToDelete, token)
            if (!response.ok) {
                throw new Error("Unable to delete session.")
            }

            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                throw error
            }
        }
    }

    async function updateSession(idToUpdate: number, addSession: AddSession) {
        if (token === null) {
            return
        }
        try {
            const response = await updatePracticeSession(idToUpdate, addSession, token)
            if (!response.ok) {
                throw new Error("Unable to update session.")
            }

            const sessions = await fetchPracticeSessions(token)
            setSessions(sessions)
        } catch (error) {
            if (error instanceof AuthenticationError) {
                logout()
            } else {
                throw error
            }
        }
    }

    return { sessions, isLoadingSessions, sessionsError, createSession, deleteSession, updateSession }
}