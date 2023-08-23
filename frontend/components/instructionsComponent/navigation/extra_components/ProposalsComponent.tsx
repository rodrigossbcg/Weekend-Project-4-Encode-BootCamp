import React, { useState } from 'react';
import { useContractRead } from 'wagmi'
import Ballot from '../../../specs/Ballot.json';
import { promises } from 'dns';
import { hexToString } from 'viem';
import { fromAscii } from 'web3-utils';

export default function ProposalsComponent() {
  type ProposalData = [string, BigInt];
  const { data, isError, isLoading } = useContractRead({
    address: '0x14d3f34208c82A3458f82Dd7CdBe5CE2bd9B39ce',
    abi: Ballot.abi,
    functionName: 'proposals',
    args: [0],   
  }) as { data: ProposalData, isError: boolean, isLoading: boolean };

  if (isError) return <div> An error occurred </div>;
  if (isLoading) return <div> Fetching result </div>;

  // Decode the hex value
  const decodedName1 = data[0].toString();
 const decodedName= parseInt(decodedName1);
  return (
    <div>
      <p>Name: {data[0]}</p>
      <p>Value: {data[1].toString()}</p>
    </div>
  );
}

export  function ProposalsComponent2() {
  type ProposalData = [string, BigInt];
  const { data, isError, isLoading } = useContractRead({
    address: '0x14d3f34208c82A3458f82Dd7CdBe5CE2bd9B39ce',
    abi: Ballot.abi,
    functionName: 'proposals',
    args: [1],   
  }) as { data: ProposalData, isError: boolean, isLoading: boolean };

  if (isError) return <div> An error occurred </div>;
  if (isLoading) return <div> Fetching result </div>;

  // Decode the hex value
  const decodedName1 = data[0].toString();
 const decodedName= parseInt(decodedName1);
  return (
    <div>
      <p>Name: {data[0]}</p>
      <p>Value: {data[1].toString()}</p>
    </div>
  );
}
