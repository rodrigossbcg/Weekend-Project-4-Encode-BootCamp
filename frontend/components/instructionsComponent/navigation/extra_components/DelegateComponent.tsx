import React, { useState, useEffect } from 'react';

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
            const delegateTokens = async () => {
                setIsDelegating(true);
                try {
                    const response = await fetch('http://localhost:3001/delegate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            delegator: delegatorAddress,
                            delegatee: delegatee
                        }),
                    });

                    const data = await response.json();

                    if (data.hash) {
                        setIsSuccess(true);
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
                    <button onClick={() => setShouldDelegate(true)} disabled={isDelegating}>
                        {isDelegating ? 'Delegating...' : 'Delegate'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DelegateComponent;