import { UploaderRequestStatus } from "@core/enums/uploader-request-status.enum";

// decoded token model
export interface DecodedTokenModel {
    uid: number;
    username: string;
    email: string;
    role: 'user' | 'uploader' | 'admin';
    joined: string;
    hasPfp: boolean;
    uploaderRequestStatus: UploaderRequestStatus;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
}