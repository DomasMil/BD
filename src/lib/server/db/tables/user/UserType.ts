import type { AttemptType } from "../attempt/AttemptType";
import type { CompanyType } from "../company/CompanyType";

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

export type MyUserType = {
    id:            number,
    companyId:     number,
    username:      string,
    password:      string,
    email:         string,
    name:          string,
    role:          string,
    companyname:   string
}