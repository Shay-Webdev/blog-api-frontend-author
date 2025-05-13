import { coerce, z, boolean, number, string, object } from "zod";
import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import { userInSession } from "../../utilities/userInSession";
import { type fetchWrapperParam, getApi } from "../../utilities/fetchWrapper";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { ErrorBoundaryWrapper } from "../Error/Error";
import { useErrorBoundary } from "react-error-boundary";
import { Link, useParams } from "react-router-dom";
import { MyButton } from "../../components/CustomButton/CustomButton";

const commentSchema = z.object({
  user: object({
    username: string(),
  }),
  postId: number(),
  id: number(),
  content: string(),
  userId: number(),
  isPosted: boolean(),
  postedDate: coerce.date(),
  updatedDate: coerce.date(),
});
const commentsSchema = z.array(commentSchema);
type Comment = z.infer<typeof commentSchema>;

const Comment = (
  props: Pick<Comment, "user" | "id" | "postedDate" | "content">,
) => {
  const { postedDate, content, user, id } = props;

  return (
    <div key={id} className={styles.comment_card}>
      <div className={styles.comment_content}>{content}</div>
      <div className={styles.comment_details}>
        <h4>~{user.username}</h4>
        <h5>({postedDate.toString()})</h5>
      </div>
    </div>
  );
};

const Comments = () => {
  const [status, setStatus] = useState<"done" | "pending">("pending");
  const [comments, setComments] = useState<Comment[]>([]);
  const params = useParams();
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    async function asyncHandler() {
      try {
        const user = await userInSession();
        console.log(`postId param in comments: `, params.postId);
        const commentsParams: fetchWrapperParam = {
          url: `http://localhost:3000/posts/${params.postId}/comments`,
          opts: {
            headers: {
              authorization: `Bearer ${user?.accessToken}`,
            },
          },
        };
        const response = await getApi(commentsParams);
        if (!response.status) {
          throw new Error(`failed to fetch comments`);
        }
        const parsedComments = commentsSchema.safeParse(response.data);
        if (!parsedComments.success) {
          console.error(`inalid post data: `, parsedComments.error);
          throw new Error(`invalid post data `);
        }

        setComments(parsedComments.data);

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
    <section className={styles.comments_container}>
      <h1>
        Share your opinions here{" "}
        <span>
          <Link to={`/posts/${params.postId}/comments`}>
            <MyButton buttonExtraStyle={styles.add_comment_button}>+</MyButton>
          </Link>
        </span>{" "}
      </h1>
      {comments.map((comment) => {
        return (
          <Comment
            postedDate={comment.postedDate}
            user={comment.user}
            content={comment.content}
            id={comment.id}
          />
        );
      })}
    </section>
  );
};

const CommentsWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <Comments />
    </ErrorBoundaryWrapper>
  );
};
export { Comments, CommentsWrapper };
