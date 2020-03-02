import 'reflect-metadata';
import {Body, Get, JsonController, Param, Post, UseBefore} from 'routing-controllers';
import {Inject} from 'typedi';
import AuthenticationMiddleware from "../middleware/AuthenticationMiddleware";
import UserService from "../integration/UserService";
import UserDTO from "../dto/UserDTO";
import UserCreateRequestDTO from "../dto/UserCreateRequestDTO";
import UserCreateResponseDTO from "../dto/UserCreateResponseDTO";

@JsonController('/users')
export default class UserController {

    @Inject()
    private userService: UserService;

    @Post()
    public createUser(@Body() request: UserCreateRequestDTO): Promise<UserCreateResponseDTO> {
        return this.userService.create(request);
    }

    @Get("/:id")
    @UseBefore(AuthenticationMiddleware)
    public findById(@Param('id') id: string): Promise<UserDTO> {
        return this.userService.findById(id);
    }
}
