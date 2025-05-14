import { string, z, ZodError } from "zod";
import { MyButton } from "../../../components/CustomButton/CustomButton";
import { CustomForm } from "../../../components/CustomForm/MyForm";
import { MyInput } from "../../../components/CustomInput/CustomInput";
import { ErrorBoundaryWrapper } from "../../Error/Error";
import styles from "./CreatePost.module.css";
import { useNavigate } from "react-router-dom";
import { urlPaths } from "../../../utilities/urlPaths";
import { useErrorBoundary } from "react-error-boundary";
import {
  postApi,
  type fetchWrapperParam,
} from "../../../utilities/fetchWrapper";
import { useActionState, useState, type ChangeEventHandler } from "react";
import { userInSession } from "../../../utilities/userInSession";

const createPostSchema = z.object({
  title: string(),
  content: string(),
});

type CreatePost = z.infer<typeof createPostSchema>;
const CreatePost = () => {
  const navigate = useNavigate();
  const createPostUrl = urlPaths.postUrl.posts;
  const { showBoundary } = useErrorBoundary();

  const formAcion = async (prevState: unknown, formData: FormData) => {
    const formValues = Object.fromEntries(formData);
    const result = createPostSchema.safeParse(formValues);
    if (result.error) {
      console.log(
        `error in login validation: `,
        result.error.message,
        prevState,
      );
      return result.error;
    }
    try {
      const user = await userInSession();
      const createPostProps: fetchWrapperParam = {
        url: createPostUrl,

        opts: {
          headers: {
            authorization: `Bearer ${user?.accessToken}`,
          },
          body: formValues,
        },
      };
      const response = await postApi(createPostProps);
      console.log(`post data in create post: `, response.data);
      navigate(`/`);

      return response;
    } catch (error) {
      showBoundary(error);
    }
  };

  const [state, action, isPending] = useActionState(formAcion, undefined);
  const [inputValue, setInputValue] = useState<Partial<CreatePost> | undefined>(
    undefined,
  );

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue({
      ...inputValue,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const onChangeHandlerTextArea: ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    setInputValue({
      ...inputValue,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  return (
    <section className={styles.createpost_container}>
      <CustomForm action={action} legend="Make Your Blog" method="POST">
        {" "}
        <MyInput
          value={inputValue?.title}
          onChange={onChangeHandler}
          type="text"
          id="post_title"
          placeholder="Say what's your blog is about"
          name="title"
        ></MyInput>
        <textarea
          name="content"
          id="content"
          value={inputValue?.content}
          onChange={onChangeHandlerTextArea}
        ></textarea>
        {state instanceof ZodError && (
          <span style={{ color: "red" }} className={styles.error_span}>
            {state?.errors.map((error) => {
              return <p>* {error.message}</p>;
            })}
          </span>
        )}
        <MyButton type="submit" disabled={isPending}>
          Post it!
        </MyButton>
      </CustomForm>
    </section>
  );
};

const CreatePostWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <CreatePost />
    </ErrorBoundaryWrapper>
  );
};

export { CreatePost, CreatePostWrapper };
