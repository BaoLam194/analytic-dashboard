import styles from "./Card.module.css";
export default function Card({ source, title, description }) {
  return (
    <div className={styles.boxcontainer}>
      <img src={source}></img>
      <h1 className={styles.test}>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
