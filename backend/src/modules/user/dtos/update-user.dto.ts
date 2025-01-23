import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsArray } from "class-validator";
import { string } from "joi";

export class UpdateUserDto {    
      @ApiProperty({
        example: 'Oleg',
        description: 'Firstname of user',
        required: true,
      })
      @IsString()
      @Optional()
      firstName: string;
    
      @ApiProperty({
        example: 'Additional information about yourself that may be interesting',
        description: 'Information about yourself',
        required: true,
      })
      @IsString()
      @Optional()
      description: string;
    
      @ApiProperty({
        example: '25',
        description: 'Enter the age between 18 and 99',
        required: true,
      })
      @IsNumber()
      @Optional()
      age: number;
    
      @ApiProperty({
        example: 'acquaintance, friendship',
        description: 'describes the purpose of staying on the site',
        required: true,
      })
      @IsArray()
      @Type(() => string)
      @Optional()
      purpose: string[];
    
      @ApiProperty({
        example: 'firebase',
        description: 'the main photo',
        required: true,
      })
      @IsString()
      @Optional()
      mainPhoto: string;
    
      @ApiProperty({
        example: 'photo1, photo2',
        description: 'a collection of your photos',
        required: true,
      })
      @IsArray()
      @Type(() => string)
      @Optional()
      photos: string[];
    
      @ApiProperty({
        example: 'BY',
        description: 'Country of residence',
        required: true,
      })
      @IsString()
      @Optional()
      location: string;
}