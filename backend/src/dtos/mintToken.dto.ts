import { ApiProperty } from "@nestjs/swagger";


export class MintTokenDTO {
    @ApiProperty({type: String, required: true, default: "Default value"})
    address: string;
    to: string;
    amount: string;
}
