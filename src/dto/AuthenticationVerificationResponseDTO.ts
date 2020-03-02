export default class AuthenticationVerificationResponseDTO {
    constructor(
        public auth: boolean,
        public message: string
    ) {
    }
}
