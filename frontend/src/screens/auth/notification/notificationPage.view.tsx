import { FC, memo, useEffect, useState } from "react";
import { Column } from "../../../components/column/column";
import { Link } from "react-router-dom";
import { Text } from "../../../components/text";
import { theme } from "../../../themes/theme";
import Header from "../../../components/header/Header";
import { NotificationInfo } from "../../../store/reducers/all/notification-slice";
import { Button, Card, Spacer } from "@nextui-org/react";

export type NotificationViewProps = {
  notifications: NotificationInfo[];
  handleStatusChange: (_id: string, status: boolean) => void;
  handleDeleteNotifications: (_id: string) => void;
};

export const NotificationView: FC<NotificationViewProps> = memo(
  ({ notifications, handleStatusChange, handleDeleteNotifications }) => {
    const [showRead, setShowRead] = useState<boolean>(() => {
      const storedState = localStorage.getItem("showRead");
      return storedState ? JSON.parse(storedState) : false;
    });

    useEffect(() => {
      localStorage.setItem("showRead", JSON.stringify(showRead));
    }, [showRead]);

    const filteredNotifications = notifications.filter(
      (notification) => notification.status === showRead
    );

    const handleButtonClick = (readStatus: boolean) => {
      setShowRead(readStatus);
      localStorage.setItem("showRead", JSON.stringify(readStatus));
    };

    return (
      <>
        <Header />
        <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
          <Button
            color={showRead ? "default" : "primary"}
            onClick={() => handleButtonClick(false)}
          >
            Непрочитанные
          </Button>
          <Button
            color={showRead ? "primary" : "default"}
            onClick={() => handleButtonClick(true)}
          >
            Прочитанные
          </Button>
        </div>
        <Column>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card key={notification._id} style={{ padding: "10px", width: "100%", cursor: "pointer", marginBottom: "10px" }}>
                <Column>
                  <Link
                    to={`/user/${notification.sender}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center"
                    }}
                    onClick={(e) => handleStatusChange(notification._id, true)}
                  >
                    <Text themeFont={theme.fonts.m1}>
                      {notification.message}
                    </Text>
                  </Link>
                  {notification.status && (
                    <>
                      <Spacer y={0.5} />
                      <Button
                        color="danger"
                        onClick={() => {
                          handleDeleteNotifications(notification._id);
                        }}
                      >
                        Удалить
                      </Button>
                    </>
                  )}
                </Column>
              </Card>
            ))
          ) : (
            <Text themeColor="gray" themeFont={theme.fonts.m1}>
              Уведомления не найдены
            </Text>
          )}
        </Column>
      </>
    );
  }
);
