import {Service} from "typedi";
import {IRestResponse, RestClient} from "typed-rest-client/RestClient";
import {HttpError} from "routing-controllers";
import UserDTO from "../dto/UserDTO";
import UserCreateRequestDTO from "../dto/UserCreateRequestDTO";
import UserCreateResponseDTO from "../dto/UserCreateResponseDTO";
import {format} from "util";

@Service()
export default class UserService {

    private client: RestClient;

    constructor() {
        const clientId = 'user-client';
        const url = format("http://%s:8083", process.env.USER_API_HOST || 'localhost');
        this.client = new RestClient('user-client', url);
        console.info(format('Created rest client %s with url %s.', clientId, url));
    }

    /**
     * Persists a new user into the database.
     * @param request The object containing the user information to be persisted.
     * @return The created user if success.
     */
    public async create(request: UserCreateRequestDTO): Promise<UserCreateResponseDTO> {
        try {
            const response: IRestResponse<UserCreateResponseDTO> =
                await this.client.create<UserCreateResponseDTO>('/users', request);
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }

    /**
     * Search for a specific user by its identifier.
     * @param email The user identifier.
     * @return The user if found.
     */
    public async findById(email: string): Promise<UserDTO> {
        try {
            const response: IRestResponse<UserDTO> = await this.client.get<UserDTO>('/users/' + email);
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }
}
