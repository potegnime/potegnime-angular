import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';

// decoded token model
export interface DecodedTokenModel {
  username: string;
  email: string;
  role: 'user' | 'uploader' | 'admin';
  joined: string;
  pfp: string;
  // uploaderRequestStatus: UploaderRequestStatus;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}
