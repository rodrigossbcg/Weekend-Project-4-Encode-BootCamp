import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage } from 'wagmi';
import TransferTokensComponent from "../instructionsComponent/navigation/extra_components/TransferTokensComponent"
import DelegateComponent from "../instructionsComponent/navigation/extra_components/DelegateComponent"

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
        <WalletBalance address={address}></WalletBalance>
        <ERC20Votes address={address}></ERC20Votes>
        <MintTokenButton address={address}></MintTokenButton>
        <TransferTokensComponent senderAddress={address}></TransferTokensComponent>
        <DelegateComponent delegatorAddress={address}></DelegateComponent>
      </div>
    );
  }

  if (isConnecting) return <p>Loading...</p>;
  if (isDisconnected) return <p>Wallet disconnected</p>;
  return null;
}

function WalletBalance({ address }: { address: string }) {
  const { data, isError, isLoading } = useBalance({ address });

  if (isError) return <div>An error occurred</div>;
  if (isLoading) return <div>Fetching result</div>;
  if (data) return <p>Balance: {data?.formatted} {data?.symbol}</p>;
  return null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ERC20Votes({ address }: { address: string }) {
  return (
    <div>
      <p>ERC-20 Votes Address: {ERC20VotesAddress()}</p>
      <p>Balance: {Balance(address)}</p>
      <p>Voting Power: {Votes(address)}</p>
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
///////////////////////////////////////////////////////////////////

type Props = {
  address: string;
};

// nao sei se teremos de usar UseTransactions
const MintTokenButton: React.FC<Props> = ({ address }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldMint, setShouldMint] = useState(false);

  useEffect(() => {
      if (shouldMint) {
          const mintTokens = async () => {
              setIsMinting(true);
              try {
                  const response = await fetch('http://localhost:3001/mint-tokens', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ address, amount: 1 }),
                  });

                  const data = await response.json();

                  if (data.hash) {
                      setIsSuccess(true);
                  } else {
                      alert("Failed ");
                  }
              } catch (error) {
                  alert("error minting tokens.");
                  console.error("Error minting tokens:", error);
              } finally {
                  setIsMinting(false);
              }
          };

          mintTokens();
          setShouldMint(false); // reset
      }
  }, [shouldMint, address]);

  return (
      <div>
          {isSuccess ? (
              <p>Tokens minted successfully!</p>
          ) : (
              <button onClick={() => setShouldMint(true)} disabled={isMinting}>
                  {isMinting ? 'Minting...' : 'Mint Tokens'}
              </button>
          )}
      </div>
  );
};

