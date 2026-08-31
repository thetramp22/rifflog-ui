export type Statistic = {
    name: string;
    value: string;
}

type ApiMostPracticedSkill = {
    name: string;
    total_minutes: number;
}

export type ApiStats = {
    total_minutes: number;
    total_sessions: number;
    most_practiced_skill: ApiMostPracticedSkill | null;
    longest_session: number;
}

type MostPracticedSkill = {
    name: string;
    totalMinutes: number;
}

export type Stats = {
    totalMinutes: number;
    totalSessions: number;
    mostPracticedSkill: MostPracticedSkill | null;
    longestSession: number;
}
