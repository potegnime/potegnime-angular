export interface UserModel {
  username: string;
  email: string;
  role: 'user' | 'uploader' | 'admin';
  hasPfp: boolean;
  joined: string;
}
