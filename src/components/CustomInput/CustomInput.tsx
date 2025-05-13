import type {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from "react";
import styles from "./CustomInput.module.css";

type CustomInputProps = {
  type: HTMLInputTypeAttribute;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
} & InputHTMLAttributes<HTMLInputElement>;
const CustomInput = (props: CustomInputProps) => {
  const { type, value, onChange, className, name, ...rest } = props;
  return (
    <input
      type={type}
      className={className}
      onChange={onChange}
      value={value}
      name={name}
      {...rest}
    />
  );
};

type MyInputProps = {} & CustomInputProps;
const MyInput = (props: MyInputProps) => {
  const { type, onChange, value, id, name, placeholder, ...rest } = props;
  return (
    <div className={styles.myinput_container}>
      <CustomInput
        className={styles.custom_input}
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export { CustomInput, MyInput };
