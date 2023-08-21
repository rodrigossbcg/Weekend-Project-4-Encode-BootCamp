import React, { useState } from 'react';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Ballot from '../specs/Ballot.json';
import { configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, publicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: '9-ydbW0SIGOuPV8kX0A_JTxWo-rhtcoK' }), publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
})


const BALLOT_CONTRACT_ADDRESS = '0x1403Dfb1B3f73374dcC517652C12Be40E4e57588';

interface Proposal {
    name: bytes32;
    voteCount: number;
}

type bytes32 = string; // Adjust if needed

export const VoteComponent: any = () => {
    const [proposalIndex, setProposalIndex] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);

    const { config: initialConfig, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        address: BALLOT_CONTRACT_ADDRESS,
        abi: Ballot.abi,
        functionName: 'vote',
    });

    const configWithArgs = {
        ...initialConfig,
        args: [proposalIndex, amount]
    };

    const { data, error: writeError, isError: isWriteError, write } = useContractWrite(configWithArgs);

    const handleVote = () => {
        if (write) {
            write();
        }
    };

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return (
        <div>
            <input 
                type="number" 
                placeholder="Proposal Index" 
                value={proposalIndex}
                onChange={(e) => setProposalIndex(Number(e.target.value))}
            />
            <input 
                type="number" 
                placeholder="Amount" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
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

export default VoteComponent;