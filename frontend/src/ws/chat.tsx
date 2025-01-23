import React, { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useTypedSelector } from '../hooks/use-typed-selector';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { getProfile } from '../store/reducers/all/profile-slice';
import { fetchUser } from '../store/reducers/all/user-slice';
import { ChatMessage, editMessage, fetchChatMessages, removeMessage } from '../store/reducers/chats/chat-slice';
import Header from '../components/header/Header';

export const socket: Socket = io('http://localhost:4000');

const GlobalStyle = createGlobalStyle`
  body, html {
    overflow: hidden;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 10px auto 0px auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
`;

const ChatHeader = styled.div`
  margin-top: 60px;
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.5em;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const UserDetailsAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserDetailsName = styled.span`
  font-size: 1.2em;
  font-weight: bold;
`;

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  max-height: calc(100vh - 150px);
`;

const MessageContainer = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const MessageText = styled.div<{ isOwnMessage: boolean }>`
  max-width: 60%;
  padding: 10px;
  background-color: ${({ isOwnMessage }) => (isOwnMessage ? '#dcf8c6' : '#f1f1f1')};
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const SenderName = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Button = styled.button`
  margin-left: 5px;
  padding: 5px 10px;
  background-color: #0084ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #006bbd;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
`;

const EditControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`;

const MessagesList: React.FC<{ 
  messages: ChatMessage[]; 
  profileState: any; 
  onEdit: (id: string, content: string) => void; 
  onDelete: (id: string) => void; 
}> = ({ messages, profileState, onEdit, onDelete }) => {
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContextMenu = (event: React.MouseEvent, messageId: string) => {
    event.preventDefault();
    setSelectedMessage(messageId === selectedMessage ? null : messageId);
  };

  const handleEditStart = (messageId: string, content: string) => {
    setEditingMessage(messageId);
    setEditedContent(content);
    setSelectedMessage(null);
  };

  const handleEditSave = () => {
    if (editingMessage && editedContent.trim()) {
      onEdit(editingMessage, editedContent);
      setEditingMessage(null);
      setEditedContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
    setEditedContent('');
  };

  return (
    <MessageListContainer>
      {messages.map((msg) => {
        const isOwnMessage = msg.sender === profileState.user?._id;
        const isEditing = editingMessage === msg._id;
        const isSelected = selectedMessage === msg._id;
        const formattedDate = new Date(msg.timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        return (
          <MessageContainer
            key={msg._id}
            isOwnMessage={isOwnMessage}
            onContextMenu={(e) => handleContextMenu(e, msg._id)}
          >
            <SenderName>{formattedDate}</SenderName>
            <MessageText isOwnMessage={isOwnMessage}>
              {isEditing ? (
                <>
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <EditControls>
                    <Button onClick={handleEditSave}>Save</Button>
                    <Button onClick={handleEditCancel}>Cancel</Button>
                  </EditControls>
                </>
              ) : (
                <p>{msg.message}</p>
              )}
            </MessageText>
            {isOwnMessage && isSelected && !isEditing && (
              <div
                style={{
                  marginTop: '5px',
                  display: 'flex',
                  gap: '10px',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                }}
              >
                <Button onClick={() => handleEditStart(msg._id, msg.message)}>
                  Edit
                </Button>
                <Button onClick={() => onDelete(msg._id)}>Delete</Button>
              </div>
            )}
          </MessageContainer>
        );
      })}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};


const ChatComponent: React.FC = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useAppDispatch();
  const chatState = useTypedSelector((state) => state.chat);
  const profileState = useTypedSelector((state) => state.profile);
  const userState = useTypedSelector((state) => state.user);
  const sender = profileState.user?._id;
  const receiver = userState.user?._id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (id) {
        dispatch(getProfile());
        dispatch(fetchUser(id));
        dispatch(fetchChatMessages(id));
      }

    socket.emit('user:join', { sender, receiver });
    const handleReceiveMessage = () => {
      if (id) dispatch(fetchChatMessages(id));
    };
    socket.on('message:receive', handleReceiveMessage);

    return () => {
      socket.off('message:receive', handleReceiveMessage);
    };
  }, [id, dispatch, sender, receiver]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() && sender && receiver) {
      socket.emit('message:send', { sender, receiver, message: newMessage });
      setNewMessage('');
    }
  }, [newMessage, sender, receiver]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = useCallback((id: string, content: string) => {
    dispatch(editMessage(id, content)).then(() => {
      socket.emit('message:update', { sender, receiver, message: newMessage });
    });
  }, [dispatch, newMessage, receiver, sender]);

  const handleDeleteMessage = useCallback((id: string) => {
    dispatch(removeMessage(id)).then(() => {
      socket.emit('message:delete', { sender, receiver, message: newMessage });
    });
  }, [dispatch, newMessage, receiver, sender]);

  return (
    <>
      <Header />
      <GlobalStyle />
      <Container>
        <ChatHeader>
          <Avatar src={userState.user?.mainPhoto || 'default-avatar.png'} alt="Your Avatar"   style={{
    width: '50px', // Укажите желаемую ширину
    height: '50px', // Укажите желаемую высоту
    borderRadius: '50%', // Делает аватар круглым
    objectFit: 'cover', // Обеспечивает правильные пропорции
  }} />
          <UserName>{userState.user?.firstName || 'User'}</UserName>
          <UserDetails>
            <UserDetailsAvatar src={profileState.user?.mainPhoto || 'default-avatar.png'} alt="Chat Partner Avatar"  style={{
    width: '50px', // Укажите желаемую ширину
    height: '50px', // Укажите желаемую высоту
    borderRadius: '50%', // Делает аватар круглым
    objectFit: 'cover', // Обеспечивает правильные пропорции
  }}/>
            <UserDetailsName>{profileState.user?.firstName || 'Chat Partner'}</UserDetailsName>
          </UserDetails>
        </ChatHeader>
        <MessagesList 
          messages={chatState.messages} 
          profileState={profileState} 
          onEdit={handleEditMessage} 
          onDelete={handleDeleteMessage} 
        />
        <div ref={messagesEndRef} />
        <InputContainer>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </InputContainer>
      </Container>
    </>
  );
};

export default ChatComponent;
