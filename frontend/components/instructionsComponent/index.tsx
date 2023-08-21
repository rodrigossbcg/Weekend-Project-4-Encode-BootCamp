import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage } from 'wagmi';
import TransferTokensComponent from "../instructionsComponent/navigation/extra_components/TransferTokensComponent"
import MintTokenButton from "../instructionsComponent/navigation/extra_components/MintComponent"
import DelegateComponent from "../instructionsComponent/navigation/extra_components/DelegateComponent"

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function InstructionsComponent() {
  return (
    <div className={styles.row}>
      <div className={styles.column}>
        <ContractInfo></ContractInfo>
      </div>
      <div className={styles.column}>
        <WalletInfo></WalletInfo>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ContractInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();

  if (address) {
    return (
      <div>
        <ERC20Votes address={address}></ERC20Votes>
        <br/>
        <MintTokenButton address={address}></MintTokenButton>
        <br/>
        <br/>
        <TransferTokensComponent senderAddress={address}></TransferTokensComponent>
        <br/>
        <br/>
        <DelegateComponent delegatorAddress={address}></DelegateComponent>
      </div>
    );
  }

  if (isConnecting) return <div><p>Loading...</p></div>;
  if (isDisconnected) return <div><p>Connecting to contract ERC-20 Votes</p></div>;
  return null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();

  if (address) {
    return (
      <div>
        <p>Address: {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletBalance address={address}></WalletBalance>
      </div>
    );
  }

  if (isConnecting) return <div> <p>Loading...</p></div>;
  if (isDisconnected) return <div><p>Wallet disconnected</p></div>;
  return <div></div>;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function WalletBalance(params: {address: `0x${string}`}) {
  const { data, isError, isLoading } = useBalance({address: params.address});

  if (isError) return <div>An error occurred</div>;
  if (isLoading) return <div>Fetching result</div>;
  if (data) return <div><p>Balance: {data?.formatted} {data?.symbol}</p></div>;
  return <div></div>;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ERC20Votes(params: { address: string }) {
  return (
    <div>
      <p>ERC-20 Votes Address: {ERC20VotesAddress()}</p>
      <p>Balance: {Balance(params.address)}</p>
      <p>Voting Power: {Votes(params.address)}</p>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ERC20VotesAddress() {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/erc20votes-address")
      .then((res) => res.json())
      .then((data) => {
        setAddress(data.address);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading ERC-20 Votes Address from API...</p>;
  return address || "No Address Data";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Balance(address: string) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/token-balance/${address}`)
      .then((res) => res.json())
      .then((data) => {
        setBalance(data);
        setLoading(false);
      });
  }, [address]);

  if (isLoading) return <p>Getting Token Balance...</p>;
  return balance || "No Balance Data";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Votes(address: string) {
  const [votes, setVotes] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/get-votes/${address}`)
      .then((res) => res.json())
      .then((data) => {
        setVotes(data);
        setLoading(false);
      });
  }, [address]);

  if (isLoading) return <p>Fetching Votes...</p>;
  return votes || "No Votes Data";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

type Props = {
  address: string;
};
