// decoded token model
export interface DecodedTokenModel {
    uid: number;
    username: string;
    email: string;
    role: string;
    joined: string;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
}