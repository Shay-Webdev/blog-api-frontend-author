import { useNavigate } from "react-router-dom";
import styles from "./Cards.module.css";

type CardProps = {
  postTitle: string;
  postPreview: string;
  author: string;
  postId: number;
};

const Cards = (props: CardProps) => {
  const { postTitle, postPreview, author, postId } = props;
  const navigate = useNavigate();
  const clickHandler = () => {
    const postUrl = `posts/${postId}`;
    navigate(postUrl);
  };
  return (
    <div className={styles.card} onClick={clickHandler} key={postId}>
      <h1>{postTitle}</h1>
      <p>{postPreview}</p>
      <span>~{author}</span>
    </div>
  );
};

export { Cards };
