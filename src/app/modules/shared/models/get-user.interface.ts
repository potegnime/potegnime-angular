export interface GetUserModel {
    userId: number;
    username: string;
    joined: string;
    role: 'user' | 'uploader' | 'admin';
    hasPfp: boolean;
    uploaderRequestStatus?: string;
}