import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { rmSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from './utils/generateoken';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Google OAuth login redirection' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page.' })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}


  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description:
      'Successfully authenticated with Google and received user data.',
  })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const response = await this.authService.loginOAuth(req.user); 
    res.cookie('jwt', response.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 24 * 3,
    })
    res.redirect(`http://localhost:3000?token=${response.accessToken}`);
  }

 
  @ApiOperation({ summary: 'Login using credentials' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in and tokens are returned.',
  })
  @ApiResponse({ status: 400, description: 'Login or password is missing.' })
  @ApiBody({ type: CreateUserDto, description: 'Login credentials.' })
  @Post('login')
  async signIn(@Body() dto: CreateUserDto, @Res() res: Response) {
    if (!dto.email) {
      throw new BadRequestException('Login or password is missing');
    } 
    const tokens: { accessToken: string; refreshToken: string } =
      await this.authService.signIn(dto);
    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 24 * 3,
    });
    res.send(tokens.accessToken);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid data.' })
  @ApiBody({ type: CreateUserDto, description: 'New user registration data.' })
  @Post('registration')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'Logout the user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  @Get('logout')
  async logout(@Res() res) {
    return this.authService.logout(res);
  }

  @ApiOperation({ summary: 'Check the token' })
  @ApiResponse({ status: 200, description: 'Successfully, token is correct.' })
  @Get('refresh')
  async refresh(@Res() res, @Req() req) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });
    const newTokens = await generateToken(this.jwtService, payload);
    res.cookie('jwt', newTokens.refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ accessToken: newTokens.accessToken });
  }

  @ApiOperation({ summary: 'Check the token' })
  @ApiResponse({ status: 200, description: 'Successfully, token is correct.' })
  @Get('checkAdmin')
  async checkAdmin(@Res() res, @Req() req) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });
    const isAdmin: boolean = (payload.role === "admin" ? true : false) 
    res.status(200).json({ isAdmin: isAdmin});
  }
  
}
