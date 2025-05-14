import { MyButton } from "../../components/CustomButton/CustomButton";
import { CustomForm } from "../../components/CustomForm/MyForm";
import { MyInput } from "../../components/CustomInput/CustomInput";
import styles from "./Signup.module.css";
import { urlPaths } from "../../utilities/urlPaths.ts";
import { Navigate, useNavigate } from "react-router-dom";
import { string, z, ZodError } from "zod";
import {
  type ChangeEventHandler,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryWrapper } from "../Error/Error.tsx";
import {
  type fetchWrapperParam,
  postApi,
} from "../../utilities/fetchWrapper.ts";
import { setLocalItem } from "../../utilities/localStorage.ts";
import isLoggedIn from "../../utilities/isLoggedIn.ts";
import { LoadingPage } from "../LoadingPage/LoadingPage.tsx";

const signupSchema = z.object({
  username: string().min(4, `username must contain minimun 4 characters`),
  email: string().email(),
  password: string().min(8, "password must contain minimum 8 characters"),
});

type signupCredentials = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLogged, setIsLogged] = useState<
    "loading" | "loggedIn" | "loggedOut"
  >("loading");
  useEffect(() => {
    async function asyncHandler() {
      const logged = await isLoggedIn();
      console.log(`is logged in signup: `, logged);
      if (!logged) {
        setIsLogged("loggedOut");
        return;
      }
      setIsLogged("loggedIn");
    }
    asyncHandler();
  }, []);
  const navigate = useNavigate();
  const signupURL = urlPaths.sessionUrl.signup;
  const { showBoundary } = useErrorBoundary();

  const formAcion = async (prevState: unknown, formData: FormData) => {
    const formValues = Object.fromEntries(formData);
    const result = signupSchema.safeParse(formValues);
    if (result.error) {
      console.log(`error in signup validation: `, result.error.message , prevState);
      return result.error;
    }
    try {
      const signupProps: fetchWrapperParam = {
        url: signupURL,
        opts: {
          body: { ...formValues, isAuthor: "true" },
        },
      };
      const response = await postApi(signupProps);
      const refreshToken = response.data.refreshToken;
      const accessToken = response.data.token;
      setLocalItem("authorRefreshToken", refreshToken);
      setLocalItem("authorAccessToken", accessToken);
      console.log(`signup response data in blog maker: `, response.data);
      navigate("/");

      return response;
    } catch (error) {
      showBoundary(error);
    }
  };

  const [state, action, isPending] = useActionState(formAcion, undefined);
  const [inputValue, setInputValue] = useState<
    Partial<signupCredentials> | undefined
  >(undefined);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue({
      ...inputValue,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  if (isLogged === "loading") {
    return <LoadingPage />;
  }
  if (isLogged === "loggedIn") {
    console.log(`isLogged state: `, isLogged);
    return <Navigate to="/" />;
  }
  return (
    <>
      <CustomForm legend="Signup" action={action} method="POST">
        <MyInput
          type="text"
          id="signup_username"
          name="username"
          placeholder="username: e.g., john"
          onChange={onChangeHandler}
          value={inputValue?.username}
        />
        <MyInput
          type="email"
          id="signup_email"
          name="email"
          placeholder="email: example@mail.com"
          onChange={onChangeHandler}
          value={inputValue?.email}
        />
        <MyInput
          type="password"
          id="signup_password"
          name="password"
          placeholder="password"
          onChange={onChangeHandler}
          value={inputValue?.password}
        />
        <div className={styles.button_container}>
          <MyButton type="submit" disabled={isPending}>
            Signup
          </MyButton>
        </div>
        {state instanceof ZodError && (
          <span style={{ color: "red" }} className={styles.error_span}>
            {state?.errors.map((error) => {
              return <p>* {error.message}</p>;
            })}
          </span>
        )}
      </CustomForm>
    </>
  );
};

const SignupWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <Signup></Signup>
    </ErrorBoundaryWrapper>
  );
};
export { Signup, SignupWrapper };
