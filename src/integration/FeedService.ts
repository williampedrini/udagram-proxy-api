import {Service} from "typedi";
import FeedDTO from "../dto/FeedDTO";
import FeedCreateRequestDTO from "../dto/FeedCreateRequestDTO";
import {IRestResponse, RestClient} from "typed-rest-client/RestClient";
import {HttpError} from "routing-controllers";
import {format} from "util";

@Service()
export default class FeedService {

    private client: RestClient;

    constructor() {
        const clientId = 'feed-client';
        const url = format("http://%s:8082", process.env.FEED_API_HOST || 'localhost');
        this.client = new RestClient(clientId, url);
        console.info(format('Created rest client %s with url %s.', clientId, url));
    }

    /**
     * Persists a specific feed into the database.
     * @param request The object holding the data to be persisted.
     * @return The persisted feed if success.
     */
    public async create(request: FeedCreateRequestDTO): Promise<FeedDTO> {
        try {
            const response: IRestResponse<FeedDTO> = await this.client.create<FeedDTO>('/feeds', request);
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }

    /**
     * Search for all existing feeds into database.
     * @return All existing feeds found.
     */
    public async findAll(): Promise<FeedDTO[]> {
        try {
            const response: IRestResponse<FeedDTO[]> = await this.client.get<FeedDTO[]>('/feeds');
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }

    /**
     * Search for a specific feed by its identifier.
     * @param id The feed identifier.
     * @return The feed if found any.
     */
    public async findById(id: string): Promise<FeedDTO> {
        try {
            const response: IRestResponse<FeedDTO> = await this.client.get<FeedDTO>('/feeds/' + id);
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }

    /**
     * Generates an aws signed url to retrieve an item.
     * @param key The filename to be put into the s3 bucket.
     * @return An url as a string.
     */
    public async getPutSignedUrl(key: string): Promise<string> {
        try {
            const response: IRestResponse<string> = await this.client.get<string>('/feeds/signed-url/' + key);
            return response.result;
        } catch (error) {
            throw new HttpError(408, error.message);
        }
    }
}
