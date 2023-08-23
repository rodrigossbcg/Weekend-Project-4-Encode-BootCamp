
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./navbar.module.css";
import { useNetwork} from 'wagmi';

export default function Navbar() {
  const { chain } = useNetwork();
  return (
    <nav className={styles.navbar}>
      <a href="https://alchemy.com/?a=create-web3-dapp" target={"_blank"}>
        <p>Project Files - Weekend 4</p>
      </a>
      <div>
        <ConnectKitButton />
        <p className={styles.connection_bold}>Connected to the network {chain?.name}</p>
      </div>
    </nav>
  );
}
