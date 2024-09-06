import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, Length, Min, MinLength } from "class-validator";

export class SearchUserDto {
    
    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    searchParam: string;
    
    @Type()
    @IsNumber()
    @ApiProperty()
    @Length(0, 100)
    limit: number;

    @Type()
    @IsNumber()
    @ApiProperty()
    @Min(0)
    page: number;
}