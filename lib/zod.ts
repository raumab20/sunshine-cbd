import { object, string } from 'zod';

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be at more than 8 characters")
        .max(32, "Password must be at less than 32 characters")
})