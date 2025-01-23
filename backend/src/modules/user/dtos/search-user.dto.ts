import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsArray, IsEnum, IsOptional, MaxLength, Min, Max } from "class-validator";

export class SearchUserDto {    
      @ApiProperty({
        example: '18',
        description: 'Enter the age between 18 and 99',
        required: true,
      })
      @Type(() => Number)
      @Min(18)
      @IsNumber()
      @IsNotEmpty()
      minAge: number = 18;

      @ApiProperty({
        example: '99', 
        description: 'Enter the age between 18 and 99',
        required: true,
      })
      @Type(() => Number)
      @Max(100)
      @IsNumber()
      @IsNotEmpty()
      maxAge: number;
    
      @ApiProperty({
        example: 'acquaintance, friendship',
        description: 'describes the purpose of staying on the site',
        required: true,
      })
      @IsArray()
      @IsOptional()
      @Type(() => String)
      purpose: string[];
      
      @ApiProperty({
        example: 'BY',
        description: 'Country of residence',
        required: true,
      })
      @IsOptional()
      @Type(() => String)
      location: string[];

      @ApiProperty({
        example: 'мужчина',
        description: 'Country of residence',
         required: true
      })
      @IsOptional()
      @Type(() => String)
      sex: string;

      @ApiProperty({
        example: 'false',
        description: 'Status of banned',
        required: true,
      })
      @IsOptional()
      isBanned: string;

      @ApiProperty({ default: 'asc', required: false })
      @IsOptional()
      @IsEnum(['asc', 'desc'])
      readonly sortOrder: 'asc' | 'desc';
    
      @ApiProperty({ default: 0 })
      @Type(() => Number)
      @IsNotEmpty()
      @Min(0)
      readonly offset: number = 0;
    
      @ApiProperty({ default: 2 })
      @Type(() => Number)
      @IsNotEmpty()
      @Min(1)
      readonly limit: number = 10;

      @ApiProperty({ default: '', required: false })
      @IsString()
      @IsOptional()
      @MaxLength(50)
      readonly searchQuery: string;

      
}
