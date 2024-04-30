import type { AttemptType } from "../attempt/AttemptType";

export type UserType = {
    id:            number,
    name:          string,
    username:      string,
    password:      string,
    email:         string,
    role:          string,
    points:        number,
    register_date: Date,
    
    attempts:     AttemptType[]
}