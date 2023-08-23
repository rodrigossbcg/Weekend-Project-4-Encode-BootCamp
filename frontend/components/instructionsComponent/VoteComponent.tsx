import React, { useState } from 'react';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Ballot from '../specs/Ballot.json';
import { configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'

function VoteComponent() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>('');

  // Prepare the contract write configuration for the `vote` function
  const { config, error: prepareError } = usePrepareContractWrite({
      address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      abi: Ballot.abi,
      functionName: 'vote',
      args: [selectedProposal, parseInt(amount)],  // Arguments for the vote function
  });

  const { write, error: writeError } = useContractWrite(config);

  return (
      <div>
          <h2>Vote on a Proposal</h2>

          <label>Select Proposal:</label>
          <select onChange={(e) => setSelectedProposal(Number(e.target.value))}>
              {/* For simplicity, we've hardcoded proposal options. In a real-world scenario, you'd fetch these dynamically. */}
              <option value={0}>Proposal 1</option>
              <option value={1}>Proposal 2</option>
              <option value={1}></option>
          </select>

          <label>Amount to Vote:</label>
          <input
              type="text"
              placeholder="Amount to vote"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
          />

          <button disabled={!write || selectedProposal === null} onClick={() => write?.()}>
              Vote
          </button>

          {prepareError && (
              <div>Error preparing the transaction: {prepareError.message}</div>
          )}
          {writeError && (
              <div>Error during transaction: {writeError.message}</div>
          )}
      </div>
  );
}

export default VoteComponent;