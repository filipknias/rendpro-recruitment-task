export type Pocket = {
    name: string;
    emoji: string;
    tasks: string[],
    user: string,
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export type Task = {
    description: string;
    isCompleted: boolean;
    pocket: string;
    user: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
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