export type ApiError = {
    message: string;
    error: string;
    statusCode: number;
}

export type AuthResponse = {
    token: string;
}

export type LogoutResponse = {
    message: string;
}

export type DeleteTaskResponse = { 
    message: string 
};

export type DeletePocketResponse = { 
    message: string 
};