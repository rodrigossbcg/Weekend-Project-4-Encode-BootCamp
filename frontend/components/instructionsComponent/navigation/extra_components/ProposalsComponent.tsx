import { useContractRead } from 'wagmi';
import Ballot from '../../../specs/Ballot.json';
import React, { useEffect, useState } from 'react';

function generateDivWithData(name: string, value: any) {
  return (
    <div key={name}>
      <p>Name: {name}</p>
      <p>Value: {value.toString()}</p>
    </div>
  );
}

function Proposals() {
  const [jsxElements, setJsxElements] = useState<JSX.Element[]>([]);
  const [done, setDone] = useState(false);
  const [proposalsList, setProposalsList] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isError, isLoading: contractIsLoading } = useContractRead({
    address: '0x14d3f34208c82A3458f82Dd7CdBe5CE2bd9B39ce',
    abi: Ballot.abi,
    functionName: 'proposals',
    args: [index],
  }) as { data: [string, number]; isError: boolean; isLoading: boolean };

  useEffect(() => {
    if (contractIsLoading) {
      return; // Do nothing while the contract data is loading
    }

    if (isError) {
      setIsLoading(false);
    } else if (data) {
      setProposalsList((prevList) => [...prevList, data]);
      setIndex((prevIndex) => prevIndex + 1);
    }
  }, [data, isError, contractIsLoading]);

  useEffect(() => {
    if (!isLoading && proposalsList.length > 0) {
      setJsxElements(proposalsList.map(([name, value]) => generateDivWithData(name, value)));
      setDone(true);
    }
  }, [isLoading, proposalsList]);

  return (
    <div>
      {!done ? <p>Loading... </p> : jsxElements}
    </div>
  );
}

export default Proposals;
