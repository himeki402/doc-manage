export type FormState = {
    error?: Record<string, string[]>;
    message?: string;
    success?: boolean;
    data?: any;
} | undefined