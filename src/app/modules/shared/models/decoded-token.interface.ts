import { UploaderRequestStatus } from "../../sudo/enums/uploader-request-status.enum";

// decoded token model
export interface DecodedTokenModel {
    uid: number;
    username: string;
    email: string;
    role: string;
    joined: string;
    uploaderRequestStatus?: UploaderRequestStatus;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
}