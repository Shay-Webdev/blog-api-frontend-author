import { AppError } from '../models/errors.js';
import {
  TUser,
  TPost,
  TComment,
  TErrorCode,
  TErrorMessage,
  TStatusCode,
} from '../types/types.js';

interface IUserResponse extends Omit<TUser, 'password'> {}
interface IPostResponse extends TPost {}
interface ICommentResponse extends TComment {}

interface SuccessResponse<T> {
  status: string;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

interface DevErrorResponse {
  status: TStatusCode;
  message: TErrorMessage;
  stack?: string;
  error: AppError;
  errorSource?: unknown;
  code?: TErrorCode;
}

interface ProdErrorResponse {
  status: TStatusCode;
  message: TErrorMessage;
  code?: TErrorCode;
}

type ApiResponse<T> = SuccessResponse<T> | DevErrorResponse | ProdErrorResponse;
export {
  SuccessResponse,
  DevErrorResponse,
  ProdErrorResponse,
  ApiResponse,
  IUserResponse,
  IPostResponse,
  ICommentResponse,
};
