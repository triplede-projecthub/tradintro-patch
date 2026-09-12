import { AuthenticationStrategy } from '@loopback/authentication';
import { RedirectRoute } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Request } from 'express';
import { JWTServiceUtils } from '../services';
export declare class ApiKeyStrategy implements AuthenticationStrategy {
    name: string;
    jwtService: JWTServiceUtils;
    authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined>;
    extractCredentials(request: Request): string;
}
