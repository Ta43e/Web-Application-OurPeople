import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { userApi } from "../../../api/user/usersMethod";

// Тип для сообщения
export interface ChatMessage {
  _id: string; // Уникальный идентификатор сообщения
  sender: string; // ID отправителя
  receiver: string; // ID получателя
  message: string; // Текст сообщения
  timestamp: string; // Метка времени
}

// Тип состояния чата
export interface ChatState {
  messages: ChatMessage[];
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
        state.messages = action.payload;
      },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    updateMessage(state, action: PayloadAction<{ id: string; content: string }>) {
      const { id, content } = action.payload;
      const message = state.messages.find((msg) => msg._id === id);
      if (message) {
        message.message = content;
      }
    },
    deleteMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setError,
} = chatSlice.actions;

// Асинхронные действия
export const fetchChatMessages = (chatId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await userApi.getChat(chatId);
      dispatch(setMessages(response));
    } catch (error) {
      dispatch(setError("Failed to fetch chat messages"));
    }
  };
};

export const sendMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await userApi.sendMessage("test");
      dispatch(addMessage(response));
    } catch (error) {
      dispatch(setError("Failed to send message"));
    }
  };
};

export const editMessage = (id: string, content: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userApi.updateMessage(id, content);
      dispatch(updateMessage({ id, content }));
    } catch (error) {
      dispatch(setError("Failed to edit message"));
    }
  };
};

export const removeMessage = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await userApi.deleteMessage(id);
      dispatch(deleteMessage(id));
    } catch (error) {
      dispatch(setError("Failed to delete message"));
    }
  };
};

export default chatSlice.reducer;
