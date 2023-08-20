'use client'
import styles from "./page.module.css";
import "./globals.css";
import WalletInfo from "@/components/instructionsComponent";

export default function Home() {
  return (
    <main className={styles.main}>
      <WalletInfo></WalletInfo>
    </main>
  );
}
