export type FormState = {
    error?:
    | {
        name? : string[];
        username? : string[];
        password? : string[];
    }
    message? : string;
}