export interface UserDetails {
  username: string;
  email: string;
  joined: string;
  role: 'user' | 'uploader' | 'admin';
  hasPfp?: boolean;
  // uploaderRequestStatus?: string;
}
