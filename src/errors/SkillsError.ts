export class SkillsError extends Error {
    constructor() {
        super("Failed to fetch skills")
        this.name = "SkillsError"
    }
}