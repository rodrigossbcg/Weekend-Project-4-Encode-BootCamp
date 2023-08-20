import { useEffect, useState } from "react";
import styles from "../../instructionsComponent.module.css";

type Props = {
    address: string;
  };

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
                <button className={styles.button} onClick={() => setShouldMint(true)} disabled={isMinting}>
                    {isMinting ? 'Minting...' : 'Mint Tokens'}
                </button>
            )}
        </div>
    );
  };
  
  export default MintTokenButton;