import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDTO } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("erc20votes-address")
  ERCVotesAddress(): {address: string} {
    return this.appService.ERC20VotesAddress();
  }

  @Get("ballot-address")
  BallotAddress(): {address: string} {
    return this.appService.TokenBallotAddress();
  }

  @Get("total-supply")
  totalSupply(): Promise<string> {
    return this.appService.totalSupply();
  }

  @Get("token-balance/:address")
  getTokenBalance(@Param('address') address: string): Promise<string> {
    return this.appService.getTokenBalance(address);
  }

  @Get("get-votes/:address")
  getVotes(@Param('address') address: string): Promise<string> {
    return this.appService.getVotes(address);
  }


  @Post("mint-tokens/:address")
  async mintToken(
    @Body() body: MintTokenDTO) {
      console.log({body})
      return await this.appService.mintTokens(
        body.address)
    }
  
}
