export type ApiError = {
    message: string;
    error: string;
    statusCode: number;
}

export type AuthResponse = {
    token: string;
}

export type User = {
    _id: string;
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
}

export type LogoutResponse = {
    message: string;
}

export type Pocket = {
    name: string;
    emoji: string;
    tasks: string[],
    user: string,
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export type CreatePocketResponse = Pocket;

export type GetPocketsResponse = Pocket[];

export type DeleteTaskResponse = { message: string };

export type DeletePocketResponse = { message: string };

export type Task = {
    description: string;
    isCompleted: boolean;
    pocket: string;
    user: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}