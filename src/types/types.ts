import { type JwtPayload } from "jsonwebtoken";
type TPost = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  isPublished: boolean;
  publishedDate: Date;
  updatedDate: Date;
};

type TUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  isAuthor: boolean | null;
};

//declare module 'passport' {
//  interface User extends TUser {}
//}

type TComment = {
  id: number;
  content: string;
  updatedDate: Date;
  postId: number;
  userId: number;
  isPosted: boolean;
  postedDate: Date;
};

interface IJwtPayload
  extends Pick<TUser, "email" | "username" | "isAuthor">,
    JwtPayload {}

interface IRefreshToken {
  id: number;
  token: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
}
export type { TPost, TComment, TUser, IJwtPayload, IRefreshToken };
