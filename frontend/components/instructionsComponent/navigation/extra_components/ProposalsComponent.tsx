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
  // track html answer and when its prepared 
  const [jsxElements, setJsxElements] = useState<JSX.Element[]>([]);
  const [done, setDone] = useState(false);

  // track proposals
  const [proposalsList, setProposalsList] = useState<any[]>([]);

  // track index 
  const [index, setIndex] = useState<number>(0);

  // track end of loop
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!isLoading) {
      type ProposalData = [string, number];
      const fetchData = async () => {
        const { data, isError, isLoading } = await useContractRead({
          address: '0x14d3f34208c82A3458f82Dd7CdBe5CE2bd9B39ce',
          abi: Ballot.abi,
          functionName: 'proposals',
          args: [index],
        }) as { data: ProposalData; isError: boolean; isLoading: boolean };
        console.log(data, isError, isLoading);
        if (isError) setIsLoading(false);
        if (data) {
          // when to jump to next proposal request 
          setProposalsList((prevList) => [...prevList, data]);
          setIndex((prevIndex) => prevIndex + 1);
        }
      };

      fetchData();
    }
  }, [index, isLoading]);

  useEffect(() => {
    if (!isLoading && proposalsList.length > 0) {
      setJsxElements(proposalsList.map(([name, value]) => generateDivWithData(name, value)));
      setDone(true);
    }
  }, [isLoading, proposalsList]);

  return (
    <div>
      {!done ? <p>Loading... </p> : jsxElements}
      {index}
      {isLoading}
      {proposalsList}
    </div>
  );
}

export default Proposals;
