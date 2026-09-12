export declare class Credentials {
    username?: string;
    password?: string;
}
export declare class ValidationsService {
    constructor();
    validateCredentials(credentials: Credentials): {
        username: string;
        password: string;
    };
    isNumber(value: number): boolean;
}
