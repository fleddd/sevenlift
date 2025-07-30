export interface IAuthForm {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    currentProgramId: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string
}