import App from "../Pages/App/App.tsx";
import { LoginOrSignup, NoLogin } from "../Pages/NoLoginPage/NoLogin.tsx";
import { LoginWrapper } from "../Pages/Login/Login.tsx";
import { SignupWrapper } from "../Pages/SignUp/SignUp.tsx";
import { ErrorPage } from "../Pages/Error/Error.tsx";
import { ProtectedRoute } from "../Pages/ProtectedRoute/ProtectedRoute.tsx";
import { Logout } from "../Pages/Logout/Logout.tsx";
import { PostsWrapper } from "../Pages/Posts/Posts.tsx";
import { PostWrapper } from "../Pages/Posts/Post/Post.tsx";
import { CommentsWrapper } from "../Pages/Comments/Comments.tsx";
import { CommentFormWrapper } from "../Pages/Comments/CommentForm/CommnetForm.tsx";
import type { RouteObject } from "react-router-dom";
import { CreatePostWrapper } from "../Pages/Posts/CreatePost/CreatePost.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <PostsWrapper />,
          },
          {
            path: "posts/:postId",
            element: <PostWrapper />,
            children: [
              {
                index: true,
                element: <CommentsWrapper />,
              },
              {
                path: "comments",
                element: <CommentFormWrapper />,
              },
            ],
          },
          {
            path: "posts",
            element: <CreatePostWrapper />,
          },
        ],
      },
      {
        path: "/nologin",
        element: <NoLogin />,
        children: [
          {
            index: true,
            element: <LoginOrSignup />,
          },
          {
            path: "login",
            element: <LoginWrapper />,
          },
          {
            path: "signup",
            element: <SignupWrapper />,
          },
        ],
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
];

export default routes;
