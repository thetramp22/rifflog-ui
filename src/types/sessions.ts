export type Session = {
    id: number;
    date: string;
    duration: number;
    skill: string;
    notes: string;
}

export type ApiSession = {
    session_id: number;
    skill_id: number;
    skill_name: string;
    duration_minutes: number;
    notes: string;
    practiced_at: string;
    user_id: number;
}