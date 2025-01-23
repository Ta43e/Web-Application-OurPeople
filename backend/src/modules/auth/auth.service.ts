import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

import { UserService } from '../user/user.service';
import { comparePasswords } from './utils/comparePasswords';
import { generateToken } from './utils/generateoken';
import { generatePassword } from './utils/generator';
import { hashPassword } from './utils/hashPassword';
import { User } from 'src/schemes/user.schema';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { verify, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signIn(user: CreateUserDto) {
    if (!user) throw new BadRequestException('Unauthenticated');

    const userExists = await this.findUserByLogin(user.email);
    if (!userExists) return this.registerUser(user);

    if (!comparePasswords(user.passwordHash, userExists.passwordHash))
      throw new UnauthorizedException('Wrong password!');

    return generateToken(this.jwtService, user);
  }

  async loginOAuth(user) {
    if (user) return generateToken(this.jwtService, user);
    //const password = await generatePassword();
    return this.registerUser(user);
  }

  async registerUser(user: CreateUserDto) {
    try {
      user.passwordHash = await hashPassword(user.passwordHash);
      const newUser = await this.userService.createUser(user);
      return generateToken(this.jwtService, newUser);
    } catch {
      throw new InternalServerErrorException('Error during registration');
    }
  }

  async findUserByLogin(email) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    return user;
  }

  async refresh(req: Request): Promise<string | null> {
    const jwt = req.cookies.jwt;
  
    if (!jwt) {
      return null;
    }
    try {
      const decoded = verify(jwt, process.env.REFRESH_SECRET) as JwtPayload;
      const user = await this.userModel.findById(decoded._id).exec();
      if (!user) {
        return null;  
      } 
      return jwt;
    } catch (error) {
      console.error('Invalid token:', error);
      return null; 
    }
  }
  

  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({
      message: 'Logged out successfully',
    });
  }
}