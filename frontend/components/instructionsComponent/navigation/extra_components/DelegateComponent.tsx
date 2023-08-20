import React, { useState, useEffect } from 'react';
import styles from "../../instructionsComponent.module.css";

type Props = {
    delegatorAddress: string; // senderAddress replaced by delegatorAddress for clarity
};

const DelegateComponent: React.FC<Props> = ({ delegatorAddress }) => {

    const [isDelegating, setIsDelegating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shouldDelegate, setShouldDelegate] = useState(false);
    const [delegatee, setDelegatee] = useState<string>('');

    useEffect(() => {
        if (shouldDelegate) {

            if (delegatee.length == 32) {
                const delegateTokens = async () => {

                    setIsDelegating(true);

                    try {
                        const response = await fetch(`http://localhost:3001/delegate/'${delegatee}`);
                        const data = await response.json();
                        console.log(data);
                        if (data.hash) {setIsSuccess(true);}
                        else {alert("Failed to delegate.");}
                    }
                    
                    catch (error) {
                        alert("An error occurred while delegating.");
                        console.error("Error delegating:", error);
                    }

                    finally {
                        console.log("hello2")
                        setIsDelegating(false);
                    }
                };

                delegateTokens();
                setShouldDelegate(false);
            }

            else {
                alert("Must insert a valid address.");
            }
        }
    }, [shouldDelegate, delegatorAddress, delegatee]);

    return (

        <div>
            {isSuccess ? (
                <p>Delegation successful!</p>
            ) : (
                <div>
                    <input 
                        type="text" 
                        placeholder="Delegatee Address" 
                        value={delegatee}
                        onChange={(e) => setDelegatee(e.target.value)}
                    />
                    <button className={styles.button} onClick={() =>  {
                        setShouldDelegate(true);
                        setIsDelegating(true);
                    }}
                    disabled={isDelegating}>
                        {isDelegating ? 'Delegating...' : 'Delegate'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DelegateComponent;