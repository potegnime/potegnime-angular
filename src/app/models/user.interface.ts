import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';

export interface UserModel {
  username: string;
  email: string;
  role: 'user' | 'uploader' | 'admin';
  pfp?: string;
  joined: string;
  uploaderRequestStatus?: UploaderRequestStatus;
}
