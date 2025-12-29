export interface GetUserModel {
  username: string;
  joined: string;
  role: 'user' | 'uploader' | 'admin';
  hasPfp?: boolean;
  uploaderRequestStatus?: string;
}
