import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    ) {}

     
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBannedUsers(@Req() req, @Res() res) {
    const bannedUser = await this.adminService.getAllBannedUser();
    res.json(bannedUser)
  }

  @UseGuards(JwtAuthGuard)
  @Get("/all")
  async getAllUsersWithBannedUsers(@Req() req, @Res() res) {
    const bannedUser = await this.adminService.getAllUsersWithBannedUsers(req.user._id);
    res.json(bannedUser)
  }

  @UseGuards(JwtAuthGuard)
  @Get("/banInfo/:id")
  async banInfo(@Req() req, @Res() res, @Param("id") id: string) {
    const bannedUser = await this.adminService.banInfo(id);
    res.json({message: bannedUser.message})
  }


  @UseGuards(JwtAuthGuard)
  @Post("/ban/:id")
  async banUser(@Req() req, @Param('id') id: string, @Res() res, @Body() message) {
    const bannedUser = await this.adminService.banUser(id, message.message);
    res.json(bannedUser)
  }

  @UseGuards(JwtAuthGuard)
  @Post("/unBan/:id")
  async unBanUser(@Req() req,  @Param('id') id: string, @Res() res){
    const bannedUser = await this.adminService.unBanUser(id);
    res.json(bannedUser)
  }
}
