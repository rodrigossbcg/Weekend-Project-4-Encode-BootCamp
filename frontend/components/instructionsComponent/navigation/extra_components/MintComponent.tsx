import { useEffect, useState } from "react";
import styles from "../../instructionsComponent.module.css";

type Props = {
    address: string;
  };

const MintTokenButton: React.FC<Props> = ({ address }) => {
    const [isMinting, setIsMinting] = useState(false);
    const [TxHash, setTxHash] = useState('');
    const [shouldMint, setShouldMint] = useState(false);
    const [amount, setAmount] = useState<Number>(0);

    useEffect(() => {
        if (shouldMint) {
            const mintTokens = async () => {
                setIsMinting(true);
                try {
                    const response = await fetch('http://localhost:3001/mint-tokens', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ "address": address, "amount": amount}),
                    });
                    const hash = await response.text();
                    if (hash) {
                        setTxHash(hash);
                    } else {
                        alert("Failed ");
                        console.error("Error minting tokens:", hash);
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
            <input className={styles.input} 
                type="number" 
                placeholder="Amount" 
                value={Number(amount)}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button className={styles.button} onClick={() => setShouldMint(true)} disabled={isMinting}>
                {isMinting ? 'Minting...' : 'Mint Tokens'}
            </button>
            {TxHash ? <p>TxHash: {TxHash}</p> : <p></p>}
        </div>
    );
};
  
  export default MintTokenButton;