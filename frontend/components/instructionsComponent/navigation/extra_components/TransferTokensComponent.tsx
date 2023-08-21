import React, { useState, useEffect } from 'react';
import styles from "../../instructionsComponent.module.css";

type Props = {
    senderAddress: string;
};

const TransferTokensComponent: React.FC<Props> = ({ senderAddress }) => {
    const [isTransferring, setIsTransferring] = useState(false);
    const [TxHash, setTxHash] = useState('');
    const [shouldTransfer, setShouldTransfer] = useState(false);
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        if (shouldTransfer) {
            const transferTokens = async () => {
                setIsTransferring(true);
                try {
                    const res = await fetch(`http://localhost:3001/transfer-tokens/${recipient}/${amount}`)
                    
                    const data = await res.text()
                    //const data = await res.json();
                    if (data) {
                        setTxHash(data);
                    } else {
                        alert("Failed to transfer tokens.");
                    }
                } catch (error) {
                    alert("An error occurred while transferring tokens.");
                    console.error("Error transferring tokens:", error);
                } finally {
                    setIsTransferring(false);
                }
            };
            transferTokens();
            setShouldTransfer(false); // reset trigger
        }
    }, [shouldTransfer, senderAddress, recipient, amount]);

    return (
        <div>
            <div>
                <input className={styles.input} 
                    type="text" 
                    placeholder="Recipient Address" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input className={styles.input} 
                    type="number" 
                    placeholder="Amount" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <button className={styles.button} onClick={() => setShouldTransfer(true)} 
                        disabled={isTransferring}>
                    {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
                </button>
            </div>
            {TxHash ? <p>TxHash: {TxHash}</p> : <p></p>}
        </div>
    );
};

export default TransferTokensComponent;

