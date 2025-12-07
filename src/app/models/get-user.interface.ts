export interface GetUserModel {
  username: string;
  joined: string;
  role: 'user' | 'uploader' | 'admin';
  pfp?: string;
  uploaderRequestStatus?: string;
}
