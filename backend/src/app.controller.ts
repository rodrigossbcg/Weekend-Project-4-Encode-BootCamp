import { Controller, Get, Param, Post, Query, Req} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpException, HttpStatus } from '@nestjs/common';

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

  @Get('delegate/:address')
  async delegate(@Param('address') address: string): Promise<string> {
    return await this.appService.delegate(address);
  }

  @Get('transfer-tokens/:address/:amount')
  async transferTokens(@Param('address') address: string, @Param('amount') amount: number): Promise<string> {
    //console.log(`Received request: ${request.method}, ${address}, ${amount } `)
    return await this.appService.transferTokens(address, amount);
  }

  @Post('mint')
  async mintToken(@Query('address') address: string, @Query('amount') amount: number): Promise<string> {
      return await this.appService.mintTokens(address, amount);
  }

}
