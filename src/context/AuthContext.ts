import { createContext } from "react";
import type { User } from "../types/auth"

type AuthContextType = {
    user: User | null;
    token: string | null;
    login(email: string, password: string): Promise<void>;
    logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default AuthContext