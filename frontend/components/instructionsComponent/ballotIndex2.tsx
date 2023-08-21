import React, { useState } from 'react';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Ballot from '../specs/Ballot.json';

const BALLOT_CONTRACT_ADDRESS = '0x1403Dfb1B3f73374dcC517652C12Be40E4e57588';

interface Proposal {
    name: bytes32;
    voteCount: number;
}

type bytes32 = string; // Assuming bytes32 is represented as a string

export const VoteComponent2: React.FC = () => {
    // Preparing the contract write operation for vote function without arguments
    const { config: initialConfig, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        address: BALLOT_CONTRACT_ADDRESS,
        abi: Ballot.abi,
        functionName: 'vote',
    });

    // Contract write function to submit a vote
    const { data, error: writeError, isError: isWriteError, write } = useContractWrite(initialConfig);

    // Handling the vote action
    const handleVote = () => {
        if (write) {
            write();
        }
    };

    // Waiting for the transaction to be confirmed
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return (
        <div>
            <button disabled={!write || isLoading} onClick={handleVote}>
                {isLoading ? 'Voting...' : 'Vote'}
            </button>
            
            {isSuccess && (
                <div>
                    Successfully casted your vote!
                    <div>
                        <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                    </div>
                </div>
            )}
            {(isPrepareError || isWriteError) && (
                <div>Error: {(prepareError || writeError)?.message}</div>
            )}
        </div>
    );
};

export default VoteComponent2;