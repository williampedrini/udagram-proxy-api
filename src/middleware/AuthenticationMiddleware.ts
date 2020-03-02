import {ExpressMiddlewareInterface, ForbiddenError, UnauthorizedError} from "routing-controllers";
import {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import AuthenticationService from "../integration/AuthenticationService";

export default class AuthenticationMiddleware implements ExpressMiddlewareInterface {

    private client: AuthenticationService;

    constructor() {
        this.client = Container.get(AuthenticationService);
    }

    async use(request: Request, response: Response, next: NextFunction): Promise<any> {
        const {headers} = request;
        if (!headers || !headers.authorization) {
            throw new UnauthorizedError('No authorization headers.');
        }

        const tokenBearer = headers.authorization.split(' ');
        if (tokenBearer.length !== 2) {
            throw new UnauthorizedError('Malformed token.');
        }

        if (await this.client.isJwtTokenNotValid(tokenBearer[1])) {
            throw new ForbiddenError('JWT Token is not valid.');
        }
        next();
    }
}
