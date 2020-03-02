export default class LoginResponseDTO {
    constructor(
        public auth: boolean,
        public token: string,
        public user: string
    ) {
    }
}
