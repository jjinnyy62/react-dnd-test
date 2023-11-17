import styles from './customBox.module.css';

export default function CustomBox({ children }) {
  return <div className={styles.container}>{children}</div>;
}
