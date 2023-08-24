import { useContractRead } from 'wagmi';
import Ballot from '../../../specs/Ballot.json';
import React, { useEffect, useState } from 'react';
import styles from "../../instructionsComponent.module.css";

function generateDivWithData(name: string, value: any) {
  
  const byteArray = name
  .match(/.{1,2}/g)
  ?.map(byte => parseInt(byte, 16));

if (byteArray) {
  const byteArrayUint8 = new Uint8Array(byteArray);
  const textDecoder = new TextDecoder('ascii');
  const stringValue = textDecoder.decode(byteArrayUint8);

  return (
      <tr className={styles.tr} key={name}>
        <td className={styles.td}>{stringValue}</td>
        <td className={styles.td}>{value.toString()}</td>
      </tr>
  );
}
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
    <table className={styles.table}>
      <tr className={styles.tr}>
        <th className={styles.th}>Proposal</th>
        <th className={styles.th}>Number of votes</th>
      </tr>
      {!done ? <p>Loading... </p> : jsxElements}
    </table>
  );
}

export default Proposals;
