import { IsArray, IsNotEmpty, IsString, Validate } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, Matches } from 'class-validator';
import { string } from 'joi';
import { Type } from 'class-transformer';
import { IsUniqueLogin } from '../utils/vakidate-email';

export class CreateUserDto {
  @ApiProperty({
    example: 'dr.oleg-kozak2019@gmail.com',
    description: 'Unique email of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  //@Validate(IsUniqueLogin) 
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email must be a valid email address', 
  })
  email: string;
 
  @ApiProperty({
    example: 'Oleg',
    description: 'Firstname of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Additional information about yourself that may be interesting',
    description: 'Information about yourself',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;


  @ApiProperty({
    example: 'man',
    description: 'The gender of the two is possible, male or female',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sex: string;

  @ApiProperty({
    example: '@$#sfqwf',
    description: 'Your password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @ApiProperty({
    example: '25',
    description: 'Enter the age between 18 and 99',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: 'acquaintance, friendship',
    description: 'describes the purpose of staying on the site',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => string)
  purpose: string[];

  @ApiProperty({
    example: 'firebase',
    description: 'the main photo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mainPhoto: string;

  @ApiProperty({
    example: 'photo1, photo2',
    description: 'a collection of your photos',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => string)
  photos: string[];

  @ApiProperty({
    example: 'BY',
    description: 'Country of residence',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
