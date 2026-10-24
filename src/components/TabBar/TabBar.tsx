"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TabBar.module.scss";

const tabs = [
  { href: "/", label: "今日", isActive: (path: string) => path === "/" || path.startsWith("/day") },
  { href: "/calendar", label: "カレンダー", isActive: (path: string) => path.startsWith("/calendar") },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabBar} aria-label="メイン">
      <ul className={styles.list}>
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={styles.link}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
