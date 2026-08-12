export type User = {
    id: number;
    email: string;
    createdAt: string;
}

export type LoginResponse = {
    token: string;
    user: User;
}