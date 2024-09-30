import { Name } from "./Name";

export interface User {
    id?: string,
    email: string,
    role?: string,
    name?: Name,
    timezone?: string,
}