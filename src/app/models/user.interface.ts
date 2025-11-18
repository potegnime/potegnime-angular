import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';

export interface UserModel {
  uid: number;
  username: string;
  email: string;
  role: 'user' | 'uploader' | 'admin';
  pfpPath?: string;
  joined: string;
  uploaderRequestStatus?: UploaderRequestStatus;
}
