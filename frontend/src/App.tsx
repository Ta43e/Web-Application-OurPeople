import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { MainPage } from './screens/auth/mainPage';
import { UserPage } from './screens/auth/userPage';
import { NextUIProvider } from "@nextui-org/react";
import { Profile } from './screens/auth/profile';
import PrivateRoute from './store/HOC/PrivateRoute';
import { LikePage } from './screens/auth/like/likePage';
import ChatComponent from './ws/chat';
import { NotificationPage } from './screens/auth/notification';
import { ChatsPage } from './screens/auth/chats';
import { AdminPage } from './screens/admin-panel';
import AdminRoute from './store/HOC/AdmineRoute';
import { UserAdminPage } from './screens/admin-panel/userAdminPage';
import { BannedUserPage } from './screens/admin-panel/bannedUser/bannedUserPage';
import { BanUserPage } from './screens/admin-panel/banPage';

function App() {
  
  return (
    <NextUIProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/banPage" element={<BanUserPage />} />
        <Route element={<PrivateRoute />}>
        <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="admin/user/:id" element={<UserAdminPage />} />
                <Route path="/bannedUser" element={<BannedUserPage />} />
                <Route path="*" element={<AdminPage />} />
        </Route>

          <Route path="/user" element={<MainPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/chat/:id" element={<ChatComponent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<LikePage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/notifications" element={<NotificationPage />} />

        </Route>
      </Routes>
    </NextUIProvider>
  );
}

export default App;