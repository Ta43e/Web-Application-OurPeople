import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from 'src/schemes/user.schema';
import { LoginUserDto } from './dtos/login-user.dto';
import { generateToken } from '../auth/utils/generateoken';
import { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectId, Types } from 'mongoose';
import { SearchUserDto } from './dtos/search-user.dto';
import { FirebaseService } from '../firebase/firebase-service';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotificationService } from '../notification/notification.service';
import { NotificationDocument } from 'src/schemes/notification.schema';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
     private  jwtService: JwtService,
     private firebaseService: FirebaseService,
     private notificationService: NotificationService,
    ) {}

     
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req): Promise<UserDocument[]> {
    return this.userService.findAll(req.user._id);
  }

  @Post("/login")
  async loginUser(@Body() loginData: LoginUserDto, @Res() res: Response){
    const user: UserDocument = await this.userService.login(loginData);
    const tokens: { accessToken: string; refreshToken: string } = await generateToken(this.jwtService, user);
    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 24 * 3,
    });
    res.send( {accessToken: tokens.accessToken, user: user});
  }

  @Post("/register")
  async registerUser(@Body() registerData: CreateUserDto, @Res() res: Response) {
    const user: UserDocument = await this.userService.createUser(registerData);
    const tokens: { accessToken: string; refreshToken: string } = await generateToken(this.jwtService, user);
    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 24 * 3,
    });
    res.send( {accessToken: tokens.accessToken, user: user});
  }


  @UseGuards(JwtAuthGuard)
  @Post('/deleteProfile')
  async deleteProfile(@Req() req, @Res() res): Promise<UserDocument> {
    await this.userService.deleteProfile(req.user._id);
    return res.json({});
  }


  @UseGuards(JwtAuthGuard)
  @Post("/update")
  async updateUser(@Body() updateData: UpdateUserDto, @Res() res: Response, @Req() req) {
    const user: UserDocument = await this.userService.updateUser(req.user._id, updateData);
    const tokens: { accessToken: string; refreshToken: string } = await generateToken(this.jwtService, user);
    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 24 * 3,
    });
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get/:id")
  async getUser(@Param('id') id: ObjectId, @Req() req, @Res() res) {
    const user: UserDocument = await this.userService.getUserById(id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes( new ValidationPipe( { transform: true }))
  @Get('/search')
  async searchUsers(@Query() searchParams: SearchUserDto, @Req() req): Promise<UserDocument[]> {
    console.log(searchParams);
    return await this.userService.searchUsers(searchParams, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes( new ValidationPipe( { transform: true }))
  @Get('/profile')
  async getProfile(@Req() req, @Res() res): Promise<UserDocument> {
    const user: UserDocument = await this.userService.getProfile(req.user._id);
    const notificationCount: NotificationDocument[] = await this.notificationService.getUnreadNotification(req.user._id);
    return res.json({user: user, notificationCount: notificationCount.length});
  }

  @UseGuards(JwtAuthGuard)
  @Post("/blocked/:id")
  async blockedUser(@Param('id') id: ObjectId, @Req() req, @Res() res) {
    const user: UserDocument = await this.userService.blockedUser(id, req.user._id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/unblocked/:id")
  async unblockedUser(@Param('id') id: ObjectId, @Req() req, @Res() res) {
    const user: UserDocument = await this.userService.unblockedUser(id, req.user._id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/liked/:id")
  async likedUser(@Param('id') id: ObjectId, @Req() req, @Res() res) {
    const user: UserDocument = await this.userService.likedUser(id, req.user._id);
     return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/unliked/:id")
  async unlikedUser(@Param('id') id: ObjectId, @Req() req, @Res() res) {
    const user: UserDocument = await this.userService.unlikedUser(id, req.user._id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/liked")
  async getLikedUser(@Req() req, @Res() res) {
    const user: UserDocument[] = await this.userService.getLikedUser(req.user._id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/chats")
  async getChatsUser(@Req() req, @Res() res) {
    const user: UserDocument[] = await this.userService.getChatUsers(req.user._id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/chats/delete/:id")
  async deleteChatsUser(@Req() req, @Res() res, @Param('id') id: string) {
    const user: UserDocument[] = await this.userService.deleteChatsUser(req.user._id, id);
    return res.json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/uploadedFile')
  @UseInterceptors(FileInterceptor('file'))
  async createNotes(
    @Req() req,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.firebaseService.uploudFile(file);
      return res.json(url);
    }
    else {
      return;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/checkBan")
  async getBannedStatus(@Req() req, @Res() res) {
    const isBanned: boolean = await this.userService.getBannedStatus(req.user._id);
    return res.json({isBanned: isBanned});
  }
}
