import {Inject, Service} from "typedi";
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import {IRestResponse, RestClient} from "typed-rest-client/RestClient";
import {BadRequestError, HttpError, UnauthorizedError} from "routing-controllers";
import TokenCreateResponseDTO from "../dto/TokenCreateResponseDTO";
import UserService from "./UserService";
import UserDTO from "../dto/UserDTO";
import LoginRequestDTO from "../dto/LoginRequestDTO";
import LoginResponseDTO from "../dto/LoginResponseDTO";
import {format} from "util";

@Service()
export default class AuthenticationService {

    private client: RestClient;

    @Inject()
    private userService: UserService;

    constructor() {
        const clientId = 'authentication-client';
        const url = format("http://%s:8081", process.env.AUTHENTICATION_API_HOST || 'localhost');
        this.client = new RestClient(clientId, url);
        console.info(format('Created rest client %s with url %s.', clientId, url));
    }

    /**
     * Encrypt a plain text password and compare to its equivalent hashed password found from the database.
     * @param plainTextPassword The plain text password to be used as base.
     * @param hash The current hash password persisted into the user database.
     * @return <i>true:</i> The password is valid. </br>
     *         <i>false:</i> The password is not valid.
     */
    private static async comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hash);
    }

    /**
     * Performs the login according to an email and password defined by the request.
     * @param request The object containing the login data.
     * @return The login response according to the provided data.
     */
    public async login(request: LoginRequestDTO): Promise<LoginResponseDTO> {
        const email = request.email;
        const password = request.password;

        if (!EmailValidator.validate(email)) {
            throw new BadRequestError('Email is required or malformed.');
        }
        if (!password) {
            throw new BadRequestError('Password is required.');
        }
        return this.userService.findById(email)
            .then(async (user: UserDTO) => {
                if (!user) {
                    throw new UnauthorizedError('The provided user does not exit. Unauthorized.');
                }
                await AuthenticationService.comparePasswords(password, user.passwordHash).then((isAuthValid) => {
                    if (!isAuthValid) {
                        throw new UnauthorizedError('The password does not match. Unauthorized.');
                    }
                });
                const jwtToken = await this.createJwtToken(user.email);
                return new LoginResponseDTO(true, jwtToken.token, email);
            });
    }

    /**
     * Performs a token creation based on an e-mail.
     * @param email The email used as based.
     * @return The created token response.
     */
    public async createJwtToken(email: string): Promise<TokenCreateResponseDTO> {
        try {
            const response: IRestResponse<TokenCreateResponseDTO> = await this.client.create<TokenCreateResponseDTO>('/token', {
                email: email
            });
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }

    /**
     * Verifies whether a token is valid or not.
     * @param token The token to be validated.
     * @return <i>true:</i> The token is valid. </br>
     *         <i>false:</i> The token is not valid.
     */
    public async isJwtTokenNotValid(token: string): Promise<boolean> {
        try {
            const response: IRestResponse<any> = await this.client.create<any>('/token/check', {
                token: token
            });
            return response.statusCode !== 200;
        } catch (error) {
            throw new UnauthorizedError(error.message);
        }
    }
}
