import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as MyTokenJson from "./assets/MyToken.json";

const ERC20VotesAddress = "0xbf27B5F3B2F838212D42c3035D68684Cdd6Ae869";
const TokenBallotAddress = "0x14d3f34208c82A3458f82Dd7CdBe5CE2bd9B39ce";

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
};

@Injectable()
export class AppService {

  provider: ethers.Provider;
  wallet: ethers.Wallet;
  contract: ethers.Contract;

  constructor() {

    this.provider = setupProvider();
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(ERC20VotesAddress, MyTokenJson["abi"], this.wallet);
  }

  ERC20VotesAddress(): {address: string} {
    return {address: ERC20VotesAddress};
  }

  TokenBallotAddress(): {address: string} {
    return {address: TokenBallotAddress};
  }

  totalSupply(): Promise<string> {
    return this.contract.totalSupply();
  }

  getTokenBalance(address: string): Promise<string> {
    return this.contract.balanceOf(address);
  }

  getVotes(address: string): Promise<string> {
    return this.contract.getVotes(address);
  }

  async  mintTokens(address: string) {
    const amount = 1n;
    const tx = await this.contract.mintTokens(address, amount);
    const reciept = tx.wait();
    return {"hash": true}
  }
}
