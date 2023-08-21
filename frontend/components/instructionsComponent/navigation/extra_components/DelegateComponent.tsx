import React, { useState, useEffect } from 'react';
import styles from "../../instructionsComponent.module.css";

type Props = {
    delegatorAddress: string; // senderAddress replaced by delegatorAddress for clarity
};

const DelegateComponent: React.FC<Props> = ({ delegatorAddress }) => {
    const [isDelegating, setIsDelegating] = useState(false);
    const [TxHash, setTxHash] = useState('');
    const [shouldDelegate, setShouldDelegate] = useState(false);
    const [delegaTo, setDelegatee] = useState<string>('');

    useEffect(() => {
        if (shouldDelegate) {
            const delegateTokens = async () => {
                setIsDelegating(true);
                try {
                    // Promise <String>
                    const res = await fetch(`http://localhost:3001/delegate/${delegaTo}`)
                    const hash = await res.text()
                    if (hash) {
                        setTxHash(hash);
                    } else {
                        alert("Failed to delegate.");
                    }
                } catch (error) {
                    alert("An error occurred while delegating.");
                    console.error("Error delegating:", error);
                } finally {
                    setIsDelegating(false);
                }
            };
            delegateTokens();
            setShouldDelegate(false); // reset trigger
        }
    }, [shouldDelegate, delegatorAddress, delegaTo]);

    return (
        <div>
            <div>
                <input className={styles.input} 
                    type="text" 
                    placeholder="Delegatee Address" 
                    value={delegaTo}
                    onChange={(e) => setDelegatee(e.target.value)}
                />
                <button className={styles.button} onClick={() => setShouldDelegate(true)} disabled={isDelegating}>
                    {isDelegating ? 'Delegating...' : 'Delegate'}
                </button>
            </div>
            {TxHash ? <p>TxHash: {TxHash}</p> : <p></p>}
        </div>
    );
};

export default DelegateComponent;
