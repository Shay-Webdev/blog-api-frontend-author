import type { FormHTMLAttributes, ReactNode } from "react";
import styles from "./MyForm.module.css";

type CustomFormType = {
  action: string | ((formData: FormData) => void | Promise<void>);
  legend: string;
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

const CustomForm = (props: CustomFormType) => {
  const { children, action, legend } = props;
  return (
    <form action={action} className={styles.custom_form}>
      <fieldset className={styles.custom_fieldset}>
        <legend>{legend}</legend>
        {children}
      </fieldset>
    </form>
  );
};

export { CustomForm };
