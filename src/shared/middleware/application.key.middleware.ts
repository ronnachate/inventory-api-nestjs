import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { APPLICATION_KEY_HEADER } from '../constant/generic';
import { UnauthorizedException } from '@nestjs/common';

dotenv.config();

export const ApplicationKeyMiddleware = (
    req: Request,
    res: Response,
    next: () => void,
): void => {
    // simply add applicatiopn key validate, just make it to be same as original code
    if (!req.headers[APPLICATION_KEY_HEADER] ||
        req.header[APPLICATION_KEY_HEADER] != process.env.APPLICATION_KEY) {
        if (process.env.NODE_ENV !== 'development') {
            throw new UnauthorizedException();
        }
    }
    next();
};