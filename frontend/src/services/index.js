// Services principaux
export { default as UserService } from './user/index';
export { default as AuthorService } from './Author';
export { default as ProfileService } from './Profile';
export { default as ApiInterceptor } from './ApiInterceptor';

// Services modulaires de User
export { AuthService, VerificationService, ProfileService as UserProfileService } from './user/index'; 