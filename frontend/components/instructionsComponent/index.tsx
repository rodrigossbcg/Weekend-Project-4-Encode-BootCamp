import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage } from 'wagmi'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <h1>MyDapp</h1>
      <WalletInfo></WalletInfo>
    </div>
  );
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
        <p><WalletBalance address={address}></WalletBalance></p>
        <ERC20Votes address={address}></ERC20Votes>
      </div>
    )
  }

  if (isConnecting) {return (<p>Loading...</p>)}
  if (isDisconnected) {return (<p>Wallet disconnected</p>)}
}

function WalletBalance(params: {address: any}) {
  const { data, isError, isLoading } = useBalance({address: params.address})
  if (isError) {return (<div>An error occured</div>)}
  if (isLoading) {return (<div>Fetching result</div>)}
  if (data) {return (<p>Balance: {data?.formatted} {data.symbol}</p>)}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ERC20Votes(address: any) {
  return (
  <div>
    <p>ERC-20 Votes Address: {ERC20VotesAddress()}</p>
    <p>Balance: {Balance(address)}</p>
    <p>Voting Power: {Votes(address)}</p>
  </div>);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ERC20VotesAddress() {

  const [data, setData] = useState<any>("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/erc20votes-address")
    .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading ERC 20 Votes Address from API...</p>;
  if (!data) return <p>No profile data</p>;
  return (data.address);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Balance(address: string) {
  const [data, setData] = useState<any>("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/token-balance/${address}`)
    .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Getting Token Balance...</p>;
  if (!data) return <p>No profile data</p>;
  return (<>{data}</>);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Votes(address: string) {
  const [data, setData] = useState<any>("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/get-votes/${address}`)
    .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading ERC 20 Votes Address from API...</p>;
  if (!data) return <p>No profile data</p>;
  return (<>{data}</>);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
