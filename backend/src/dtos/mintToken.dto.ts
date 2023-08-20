import { ApiProperty } from "@nestjs/swagger";


export class MintTokenDTO {
    @ApiProperty({type: String, required: true, default: "Reciever"})
    to: string;
    @ApiProperty({type: Number, required: true, default: "Amount"})
    amount: number;
}
