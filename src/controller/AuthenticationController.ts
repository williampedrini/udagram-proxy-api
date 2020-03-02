import 'reflect-metadata';
import {Body, Get, JsonController, Post, UseBefore} from 'routing-controllers';
import {Inject} from 'typedi';
import AuthenticationMiddleware from "../middleware/AuthenticationMiddleware";
import AuthenticationService from "../integration/AuthenticationService";
import AuthenticationVerificationResponseDTO from "../dto/AuthenticationVerificationResponseDTO";
import LoginResponseDTO from "../dto/LoginResponseDTO";
import LoginRequestDTO from "../dto/LoginRequestDTO";

@JsonController('/users/auth')
export default class AuthenticationController {

    @Inject()
    private authenticationService: AuthenticationService;

    @Get("/verification")
    @UseBefore(AuthenticationMiddleware)
    public verify(): AuthenticationVerificationResponseDTO {
        return new AuthenticationVerificationResponseDTO(true, 'Authenticated.');
    }

    @Post("/login")
    public login(@Body() request: LoginRequestDTO): Promise<LoginResponseDTO> {
        return this.authenticationService.login(request);
    }
}
