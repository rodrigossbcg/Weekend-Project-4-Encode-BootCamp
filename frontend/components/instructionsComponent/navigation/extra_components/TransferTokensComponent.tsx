import React, { useState, useEffect } from 'react';

type Props = {
    senderAddress: string;
};

const TransferTokensComponent: React.FC<Props> = ({ senderAddress }) => {
    const [isTransferring, setIsTransferring] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shouldTransfer, setShouldTransfer] = useState(false);
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        if (shouldTransfer) {
            const transferTokens = async () => {
                setIsTransferring(true);
                try {
                    const response = await fetch('http://localhost:3001/transfer-tokens', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sender: senderAddress,
                            recipient: recipient,
                            amount: amount
                        }),
                    });

                    const data = await response.json();

                    if (data.hash) {
                        setIsSuccess(true);
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
            {isSuccess ? (
                <p>Tokens transferred successfully!</p>
            ) : (
                <div>
                    <input 
                        type="text" 
                        placeholder="Recipient Address" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button onClick={() => setShouldTransfer(true)} disabled={isTransferring}>
                        {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransferTokensComponent;
