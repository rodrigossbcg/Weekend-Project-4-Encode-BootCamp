import { ApiProperty } from "@nestjs/swagger";


export class MintTokenDTO {
    @ApiProperty({type: String, required: true, default: "Reciever"})
    address: string;
    @ApiProperty({type: Number, required: true, default: 0})
    amount: number;
}
