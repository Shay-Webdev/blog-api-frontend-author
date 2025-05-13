import { string, z, ZodError } from "zod";
import { MyButton } from "../../../components/CustomButton/CustomButton";
import styles from "./CommentForm.module.css";
import { Link, useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import {
  type fetchWrapperParam,
  postApi,
} from "../../../utilities/fetchWrapper";
import { type ChangeEventHandler, useActionState, useState } from "react";
import { ErrorBoundaryWrapper } from "../../Error/Error";
import { userInSession } from "../../../utilities/userInSession";

const commentFormSchema = z.object({
  content: string(),
});

type CommenForm = z.infer<typeof commentFormSchema>;

const CommentForm = () => {
  const params = useParams();
  const commentpostUrl = `http://localhost:3000/posts/${params.postId}/comments`;
  const { showBoundary } = useErrorBoundary();

  const formAcion = async (prevState: unknown, formData: FormData) => {
    const formValues = Object.fromEntries(formData);
    const result = commentFormSchema.safeParse(formValues);
    if (result.error) {
      console.error(`error in comment form validation: `, result.error.message);
      return result.error;
    }
    try {
      const user = await userInSession();
      const commentPostProps: fetchWrapperParam = {
        url: commentpostUrl,
        opts: {
          headers: {
            authorization: `Bearer ${user?.accessToken}`,
          },
          body: formValues,
        },
      };
      const response = await postApi(commentPostProps);
      console.log(`params in comment form: `, params);
      return response;
    } catch (error) {
      console.error(`error in comment form: `, error);
      showBoundary(error);
    }
  };

  const [state, action, isPending] = useActionState(formAcion, undefined);
  const [inputValue, setInputValue] = useState<Partial<CommenForm> | undefined>(
    undefined,
  );

  const onChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setInputValue({
      ...inputValue,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  return (
    <form action={action} className={styles.comment_form}>
      <fieldset className={styles.comment_fieldset}>
        <legend>Comment it</legend>

        <textarea
          name="content"
          id="content"
          className={styles.comment_content}
          onChange={onChangeHandler}
        ></textarea>
        {state instanceof ZodError && (
          <span style={{ color: "red" }} className={styles.error_span}>
            {state?.errors.map((error) => {
              return <p>* {error.message}</p>;
            })}
          </span>
        )}
        <Link to={`/posts/${params.postId}`}>
          <MyButton type="submit" disabled={isPending}>
            Submit
          </MyButton>
        </Link>
      </fieldset>
    </form>
  );
};
const CommentFormWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <CommentForm />
    </ErrorBoundaryWrapper>
  );
};
export { CommentForm, CommentFormWrapper };
