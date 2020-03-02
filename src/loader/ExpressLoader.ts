import {MicroframeworkLoader, MicroframeworkSettings} from 'microframework-w3tec';
import {createExpressServer} from 'routing-controllers';
import {Application} from 'express';
import AuthenticationController from '../controller/AuthenticationController';
import {GlobalErrorHandlerMiddleware} from '../middleware/GlobalErrorHandlerMiddleware';
import AuthenticationMiddleware from "../middleware/AuthenticationMiddleware";
import UserController from "../controller/UserController";
import FeedController from "../controller/FeedController";

export const ExpressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const application: Application = createExpressServer({
            cors: true,
            controllers: [AuthenticationController, FeedController, UserController],
            defaultErrorHandler: false,
            middlewares: [AuthenticationMiddleware, GlobalErrorHandlerMiddleware],
            routePrefix: '/api/v0'
        });
        settings.setData('express_app', application);
        settings.setData('express_server', application.listen(process.env.PORT || 8080));
    }
};
