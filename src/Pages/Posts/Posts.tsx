import styles from "./Posts.module.css";
import { useEffect, useState } from "react";
import { userInSession } from "../../utilities/userInSession";
import { type fetchWrapperParam, getApi } from "../../utilities/fetchWrapper";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { ErrorBoundaryWrapper } from "../Error/Error";
import { useErrorBoundary } from "react-error-boundary";
import { Cards } from "../../components/Cards/Cards";
import { boolean, coerce, number, string, z } from "zod";

const postSchema = z.object({
  authorId: number(),
  id: number(),
  isPublished: boolean(),
  publishedDate: coerce.date(),
  title: string(),
  content: string(),
  updatedDate: coerce.date(),
});

const postsSchema = z.array(postSchema);
type Post = z.infer<typeof postSchema>;
const Posts = () => {
  const [status, setStatus] = useState<"done" | "pending">("pending");
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUserName] = useState<string | undefined>(undefined);
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    async function asyncHandler() {
      try {
        const user = await userInSession();
        const postsParams: fetchWrapperParam = {
          url: `http://localhost:3000/posts/${user?.user.sub}/posts`,
          opts: {
            headers: {
              authorization: `Bearer ${user?.accessToken}`,
            },
          },
        };
        const response = await getApi(postsParams);
        if (!response.status) {
          throw new Error(`failed to fetch posts`);
        }
        const parsedPosts = postsSchema.safeParse(response.data);
        if (!parsedPosts.success) {
          console.error(`inalid post data: `, parsedPosts.error);
          throw new Error(`invalid post data `);
        }

        setUserName(user?.user.username);
        setPosts(parsedPosts.data);

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
    <section className={styles.posts_container}>
      <h1 className={styles.posts_heading}>
        Welcome <span>{username}</span>, <br />
        Here are your posts
      </h1>
      <section className={styles.cards_container}>
        {posts.map((post) => {
          return (
            <Cards
              author={username as string}
              postPreview={post.content.split(" ").splice(0, 10).join(" ")}
              postTitle={post.title}
              postId={post.id}
            />
          );
        })}
      </section>
    </section>
  );
};

const PostsWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <Posts />
    </ErrorBoundaryWrapper>
  );
};
export { Posts, PostsWrapper };
