import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserDocument } from 'src/schemes/user.schema';
import { Response } from 'express';
import { NotificationService } from './notification.service';
import { NotificationDocument } from 'src/schemes/notification.schema';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotification(@Req() req, @Res() res): Promise<UserDocument[]> {
    const notification: NotificationDocument[] = await this.notificationService.getNotification(req.user._id);
    return res.json(notification);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/getUnreadNotification")
  async getUnreadNotification(@Req() req, @Res() res): Promise<UserDocument[]> {
    const notification: NotificationDocument[] = await this.notificationService.getUnreadNotification(req.user._id);
    return res.json(notification.length);
  }


  @UseGuards(JwtAuthGuard)
  @Post("/open/:id")
  async openNotification(@Param('id') id: ObjectId, @Res() res: Response, @Req() req) {
    const notification: NotificationDocument[] = await this.notificationService.openNotification(req.user._id, id);
    return res.json(notification);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/delete/:id")
  async deleteNotification(@Param('id') id: ObjectId, @Res() res: Response, @Req() req) {
    const notification: NotificationDocument[] = await this.notificationService.deleteNotification(req.user._id, id);
    return res.json(notification);
  }
}
