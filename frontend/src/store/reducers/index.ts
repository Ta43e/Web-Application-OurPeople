import { combineReducers } from "redux";
import loginReducer from "./auth/login-slice";
import singupReducer from "./auth/singup-slice";
import authReducer from "./auth/auth-slice";
import filterReducer from "./all/filter-slice";
import userPageReducer from "./all/user-slice";
import profileReducer from "./all/profile-slice";
import mainPageReducer from "./all/mainPage-slice";
import notificationReducer from "./all/notification-slice";
import chatReducer from "./chats/chat-slice";

export const rootReducers = combineReducers({
  singup: singupReducer,
  login: loginReducer,
  mainPage: mainPageReducer,
  user: userPageReducer,
  filter: filterReducer,
  profile: profileReducer,
  auth: authReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
