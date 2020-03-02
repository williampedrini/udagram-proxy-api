import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import {NextFunction, Request, Response} from 'express';
import AuthenticationVerificationResponseDTO from "../dto/AuthenticationVerificationResponseDTO";

@Middleware({
    type: 'after'
})
export class GlobalErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    error(error: any, request: Request, response: Response, next: NextFunction): void {
        console.error(error.message, error);
        switch (error.httpCode) {
            case 401: {
                response.status(error.httpCode).send(new AuthenticationVerificationResponseDTO(false, error.message));
                break;
            }
            default: {
                response.status(error.httpCode).send({
                    message: error.message
                });
            }
        }
        next();
    }
}
