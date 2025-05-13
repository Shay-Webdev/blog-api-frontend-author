import type { TUser, TPost, TComment } from "./types.js";
import { Request } from "express";
import { IJwtPayload } from "./types.js";

interface IUserRequestBody extends Omit<TUser, "id" | "isAuthor"> {
  id: string;
  isAuthor: "true" | "false";
}
interface ILoginReqUser {
  user?: Pick<TUser, "email" | "password">;
}
interface IReqUser extends Request {
  user?: TUser | IJwtPayload;
}
interface IUser extends Partial<TUser> {}
interface IPostRequestBody extends TPost {}
interface ICommentRequestBody extends TComment {}

export {
  IUserRequestBody,
  IPostRequestBody,
  ICommentRequestBody,
  ILoginReqUser,
  IReqUser,
  IUser,
};
