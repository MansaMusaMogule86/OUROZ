import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';
import { AppError } from '../utils/errors';

type ValidationSource = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodTypeAny, source: ValidationSource = 'body') {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const details = result.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join('; ');

            return next(new AppError(`Validation failed: ${details || 'Invalid request'}`, 400));
        }

        req[source] = result.data;
        next();
    };
}
