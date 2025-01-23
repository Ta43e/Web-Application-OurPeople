import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemes/user.schema';
import { Message, MessageDocument } from 'src/schemes/message.schema';
import { NotificationDocument, Notification } from 'src/schemes/notification.schema';

  
  @WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })
  export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
  
	constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
	  @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
	  @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
	) {}
  
	private sumDigitsFromString(str: string): number {
	  return str
		.split('')
		.filter((char) => !isNaN(parseInt(char)))
		.map((char) => parseInt(char))
		.reduce((sum, num) => sum + num, 0);
	}
  
	handleConnection(client: Socket) {
	  console.log(`Client connected: ${client.id}`);
	}
  
	handleDisconnect(client: Socket) {
	  console.log(`Client disconnected: ${client.id}`);
	}
  
	@SubscribeMessage('user:join')
	async handleUserJoin(client: Socket, payload: any) {
	  const user = await this.userModel.findById(payload.receiver);
	  if (user) {
		const key = this.sumDigitsFromString(payload.sender) + this.sumDigitsFromString(payload.receiver);
		client.join(key.toString());
	  }
	}

	@SubscribeMessage('user:joinYourRoom')
	async handleUserJoinYourRoom(client: Socket, payload: any) {
	  const user = await this.userModel.findById(payload.owner);
	  if (user) {
		client.join(user._id.toString());
	  }
	}
  
	@SubscribeMessage('message:send')
	async handleMessageSend(client: Socket, payload: any) {
	  const message = new this.messageModel({
		sender: payload.sender,
		receiver: payload.receiver,
		message: payload.message,
	  });
	  await message.save();

	  const key = this.sumDigitsFromString(payload.sender) + this.sumDigitsFromString(payload.receiver);
	  const sender = await this.userModel.findById(payload.sender) as UserDocument;
	  const receiver = await this.userModel.findById(payload.receiver) as UserDocument;
	
	  if (sender && receiver) {
		const senderId = sender._id as Types.ObjectId;
		const receiverId = receiver._id as Types.ObjectId;
	
		if (!sender.contacts.some((contact) => contact.equals(receiverId))) {
		  sender.contacts.push(receiverId);
		}
	
		if (!receiver.contacts.some((contact) => contact.equals(senderId))) {
		  receiver.contacts.push(senderId);
		}
	
		await sender.save();
		await receiver.save();
	  }
	
	  payload.message = message;
	  payload.sender = sender;
	  payload.receiver = receiver;
	
	  this.server.to(key.toString()).emit('message:receive', payload);
	}

	@SubscribeMessage('message:delete')
	async handleMessageDelete(client: Socket, payload: any) {
	  const key = this.sumDigitsFromString(payload.sender) + this.sumDigitsFromString(payload.receiver);
	  console.log(key);
	  this.server.to(key.toString()).emit('message:receive', payload);
	}

	@SubscribeMessage('message:update')
	async handleMessageUpdate(client: Socket, payload: any) {
	  const key = this.sumDigitsFromString(payload.sender) + this.sumDigitsFromString(payload.receiver);
	  this.server.to(key.toString()).emit('message:receive', payload);
	}

	@SubscribeMessage('like')
	async handleLike(client: Socket, payload: any) {
	  const sender = await this.userModel.findById(payload.liker._id);
	  const receiver = await this.userModel.findById(payload.likedUserId);
	  if (sender) {
		const message = `Пользователю ${sender.firstName} понравилась ваша фотография`;

		const notification = new this.notificationModel({
		  sender: sender,
		  receiver: receiver,
		  message,
		});
		await notification.save();
		this.server.to(receiver._id.toString()).emit('new-notification', { notification, user: sender });
	  }
	}
  }
  