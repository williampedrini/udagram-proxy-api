import 'reflect-metadata';
import {Body, Get, JsonController, Param, Post} from "routing-controllers";
import {Inject} from "typedi";
import FeedDTO from "../dto/FeedDTO";
import FeedCreateRequestDTO from "../dto/FeedCreateRequestDTO";
import FeedService from "../integration/FeedService";
import GetSignedUrlResponseDTO from "../dto/GetSignedUrlResponseDTO";

@JsonController("/feed")
export default class FeedController {

    @Inject()
    private feedService: FeedService;

    @Get()
    public async findAll(): Promise<FeedDTO[]> {
        return this.feedService.findAll();
    }

    @Get('/:id')
    public async findById(@Param('id') id: string): Promise<FeedDTO> {
        return await this.feedService.findById(id);
    }

    @Post()
    public async create(@Body() request: FeedCreateRequestDTO): Promise<FeedDTO> {
        return await this.feedService.create(request);
    }

    @Get('/signed-url/:fileName')
    public async getSignedUrl(@Param('fileName') fileName: string): Promise<GetSignedUrlResponseDTO> {
        return new GetSignedUrlResponseDTO(await this.feedService.getPutSignedUrl(fileName));
    }
}
