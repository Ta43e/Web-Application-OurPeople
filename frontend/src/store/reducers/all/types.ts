export type UserData = {
    userId: number;
	name: string;
	bio: string | null;
	email: string | null;
	hasPassword: boolean;
	password: string | null;
	status: string;
	colorChats: string;
	isShowOnline: boolean;
	isShowInList: boolean;
};



export type CreateUserDto = {
    email: string;       
    firstName: string;   
    description: string; 
    sex: string;         
    passwordHash: string;
    age: number;         
    purpose: string[];   
    mainPhoto: string;   
    photos: string[];    
    location: string;    
  };

export type MessageData = {
    messageId: number;
	senderId: number;
	receiverId: number;
	textMessage: string;
	fileMessage: Blob | null;
	dataMessage: string;
};

export type UserChatData = {
    chatId: number;
    receiverId: number;
    messages: MessageData[];
};


export type GroupMessageData = {
    groupMessageId: number;
	senderId: number;
	textGroupMessage: string;
	fileGroupMessage: Blob | null;
	dataGroupMessage: string;
};

export type UserGroupsData = {
    chatId: number;
    name: number;
    picture: number;
    messages: GroupMessageData[];
};

export type ContactsData = {
    userId: number;
	email: string;
	name: string;
	bio: string | null;
    status: string
};

export type GroupsData = {
	groupChatId: number
	picture: string
	name: string
};

