import { FC, memo, useEffect, useState } from 'react';
import { useAppDispatch, useTypedSelector } from '../../hooks/use-typed-selector';
import { Row } from '../row';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/reducers/auth/auth-slice';
import { socket } from '../../ws/chat';
import { Button } from '@nextui-org/react';
import { getProfile } from '../../store/reducers/all/profile-slice';
import { authApi } from '../../api/auth/auth-api';

const Header: FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profileState = useTypedSelector(state => state.profile);
  const { user, notification } = profileState;
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const adminStatus = await authApi.checkAdmin();
        setIsAdmin(adminStatus.isAdmin); // Устанавливаем статус администратора
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    // Emit user room join event
    socket.emit('user:joinYourRoom', { owner: user._id });

    // Update notifications on mount or notification changes
    setNotificationCount(Number(notification));

    // Handle incoming notifications
    const handleNewNotification = (data: any) => {
      console.log(data);
      if (data.user._id !== user._id) {
        setNotificationCount(prev => prev + 1);
      }
    };

    // Subscribe to socket event
    socket.on("new-notification", handleNewNotification);

    // Cleanup on unmount
    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [user?._id, notification]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const clearNotifications = () => {
    setNotificationCount(0); // Clear local notification count
    navigate("/notifications"); // Redirect to notifications page
  };

  return (
    <Row
      style={{
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#f4f4f4",
        borderBottom: "1px solid #ddd",
        justifyContent: "space-between",
        alignItems: "center",
        position: 'fixed',
        top: 0,
        zIndex: 1000
      }}
    >
      <Button
        onClick={() => handleNavigation(isAdmin ? "/admin" : "/user")}
        style={{ fontSize: "1.2em", fontWeight: "bold" }}
      >
        OurPeople
      </Button>

      {isAdmin ? (
        <Row style={{ gap: "15px" }}>
          <Button onClick={() => handleNavigation("/bannedUser")}>Забаненые</Button>
        </Row>
      ) : (
        <Row style={{ gap: "15px" }}>
          <Button onClick={() => handleNavigation("/profile")}>Профиль</Button>
          <Button onClick={() => handleNavigation("/favorites")}>Избранные</Button>
          <Button onClick={() => handleNavigation("/chats")}>Чаты</Button>
          <Button onClick={clearNotifications}>
            Уведомления {notificationCount > 0 && (
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                {notificationCount}
              </span>
            )}
          </Button>
        </Row>
      )}

      <Button
        onClick={handleLogout}
        color="danger"
      >
        Выйти
      </Button>
    </Row>
  );
});

export default Header;
