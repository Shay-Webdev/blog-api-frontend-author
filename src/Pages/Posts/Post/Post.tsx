import { z, number, string, boolean, coerce } from "zod";
import styles from "./Post.module.css";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { userInSession } from "../../../utilities/userInSession";
import {
  type fetchWrapperParam,
  getApi,
} from "../../../utilities/fetchWrapper";
import { LoadingPage } from "../../LoadingPage/LoadingPage";
import { ErrorBoundaryWrapper } from "../../Error/Error";
import { Outlet, useParams } from "react-router-dom";

const postSchema = z.object({
  authorId: number(),
  id: number(),
  isPublished: boolean(),
  publishedDate: coerce.date(),
  title: string(),
  content: string(),
  updatedDate: coerce.date(),
});

type Post = z.infer<typeof postSchema>;

const Post = () => {
  const [status, setStatus] = useState<"done" | "pending">("pending");
  const [post, setPost] = useState<Post | undefined | null>(undefined);
  const [username, setUserName] = useState<string | undefined>(undefined);
  const params = useParams();
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    async function asyncHandler() {
      try {
        const user = await userInSession();
        const postParams: fetchWrapperParam = {
          url: `http://localhost:3000/posts/${params.postId}`,
          opts: {
            headers: {
              authorization: `Bearer ${user?.accessToken}`,
            },
          },
        };
        const response = await getApi(postParams);
        if (!response.status) {
          throw new Error(`failed to fetch posts`);
        }
        const parsedPost = postSchema.safeParse(response.data);
        if (!parsedPost.success) {
          console.error(`inalid post data: `, parsedPost.error);
          throw new Error(`invalid post data `);
        }

        setUserName(user?.user.username);
        setPost(parsedPost.data);

        setStatus("done");
      } catch (error) {
        showBoundary(error);
      }
    }
    asyncHandler();
  }, [showBoundary]);
  if (status === "pending") {
    return <LoadingPage />;
  }
  return (
    <section className={styles.post_container}>
      <div className={styles.post_headings}>
        <h1>{post?.title}</h1>
        <h2>
          Author: <span>{username}</span>
        </h2>
        <h3>
          Posted: <span>{post?.publishedDate.toString()}</span>
        </h3>
        <h4>
          Edited: <span>{post?.updatedDate.toString()}</span>
        </h4>
      </div>
      <section className={styles.post_content}>{post?.content}</section>
      <Outlet />
    </section>
  );
};

const PostWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <Post />
    </ErrorBoundaryWrapper>
  );
};
export { Post, PostWrapper };
