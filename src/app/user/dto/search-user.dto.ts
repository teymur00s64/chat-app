import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length, Min, MinLength } from "class-validator";

export class SearchUserDto {
    
    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    searchParam: string;
    
    @Type()
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    @Length(0, 100)
    limit: number;

    @Type()
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    @Min(0)
    page: number;
}