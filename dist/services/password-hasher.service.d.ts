export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<T>;
    comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}
export declare class BCryptPasswordHasherService implements PasswordHasher {
    readonly rounds: number;
    comparePassword(providedPass: string, storedPass: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
}
