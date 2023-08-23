'use client'
import styles from "./page.module.css";
import "./globals.css";
import InstructionsComponent from "@/components/instructionsComponent";

export default function Home() {
  return (
    <main className={styles.main}>
      <InstructionsComponent></InstructionsComponent>
    </main>
  );
}

