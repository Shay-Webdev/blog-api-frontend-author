import { MyButton } from "../../components/CustomButton/CustomButton";
import { CustomForm } from "../../components/CustomForm/MyForm";
import { MyInput } from "../../components/CustomInput/CustomInput";
import styles from "./Login.module.css";
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
import { jwtDecode } from "jwt-decode";

const loginSchema = z.object({
  email: string().email(),
  password: string().min(8, "password must contain minimum 8 characters"),
});

type loginCredentials = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLogged, setIsLogged] = useState<
    "loading" | "loggedIn" | "loggedOut"
  >("loading");
  useEffect(() => {
    async function asyncHandler() {
      const logged = await isLoggedIn();
      console.log(`is logged in login: `, logged);
      if (!logged) {
        setIsLogged("loggedOut");
        return;
      }
      setIsLogged("loggedIn");
    }
    asyncHandler();
  }, []);
  const navigate = useNavigate();
  const loginUrl = urlPaths.sessionUrl.login;
  const { showBoundary } = useErrorBoundary();

  const formAcion = async (prevState: unknown, formData: FormData) => {
    const formValues = Object.fromEntries(formData);
    const result = loginSchema.safeParse(formValues);
    if (result.error) {
      console.log(`error in login validation: `, result.error.message);
      return result.error;
    }
    try {
      const loginProps: fetchWrapperParam = {
        url: loginUrl,
        opts: {
          body: formValues,
        },
      };
      const response = await postApi(loginProps);
      const refreshToken = response.data.refreshToken;
      const accessToken = response.data.token;
      const decodedTokens = {
        accessToken: jwtDecode(accessToken as string),
        refreshToken: jwtDecode(refreshToken as string),
      };
      setLocalItem("authorRefreshToken", refreshToken);
      setLocalItem("authorAccessToken", accessToken);
      console.log(`decoded tokens in login : `, decodedTokens);
      navigate("/");

      return response;
    } catch (error) {
      showBoundary(error);
    }
  };

  const [state, action, isPending] = useActionState(formAcion, undefined);
  const [inputValue, setInputValue] = useState<
    Partial<loginCredentials> | undefined
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
      <CustomForm legend="Login" action={action} method="POST">
        <MyInput
          type="email"
          id="login_email"
          label="Email"
          name="email"
          onChange={onChangeHandler}
          value={inputValue?.email}
        />
        <MyInput
          type="password"
          id="login_password"
          label="Password"
          name="password"
          onChange={onChangeHandler}
          value={inputValue?.password}
        />
        <div className={styles.button_container}>
          <MyButton type="submit" disabled={isPending}>
            Login
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

const LoginWrapper = () => {
  return (
    <ErrorBoundaryWrapper>
      <Login></Login>
    </ErrorBoundaryWrapper>
  );
};
export { Login, LoginWrapper };
