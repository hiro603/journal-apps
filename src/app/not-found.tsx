import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>ページが見つかりません</h1>
      <Link href="/" className={styles.link}>
        今日の記録へ
      </Link>
    </div>
  );
}
