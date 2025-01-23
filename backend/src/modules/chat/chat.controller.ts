import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ObjectId, Types } from 'mongoose';
import { MessageDocument } from 'src/schemes/message.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService, private  jwtService: JwtService){}
    
    @UseGuards(JwtAuthGuard)
    @Get(":id")  
    async getChat(@Param("id") id: string, @Res() res, @Req() req) {
        const contactId = new Types.ObjectId(id);
        const chat: MessageDocument[] = await this.chatService.getChat(req.user._id, contactId);
        return res.json(chat);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/delete/:id")  
    async deleteMsg(@Param("id") id: string, @Res() res, @Req() req) {
        const idMsg = new Types.ObjectId(id);
        const chat = await this.chatService.deleteMsg(idMsg);
        return res.json(chat);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/update/:id")  
    async updateMsg(@Param("id") id: string, @Res() res, @Req() req,  @Body() newMessage, ) {
        const idMsg = new Types.ObjectId(id);
        const updatedChat = await this.chatService.updateChat(idMsg, newMessage.content);
        if (!updatedChat) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.json(updatedChat);
    }
    
}
