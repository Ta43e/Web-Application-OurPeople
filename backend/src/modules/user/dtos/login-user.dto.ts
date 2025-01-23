import { ApiProperty } from "@nestjs/swagger";
import { Min, IsNumber, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'dr.oleg-kozak2019@gmail.com',
        description: 'Enter your email',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email must be a valid email address',
      })
      email: string;

      @ApiProperty({
        example: '33rf1geg',
        description: 'Enter your password',
        required: true,
      })
      @IsString()
      password: string;

}