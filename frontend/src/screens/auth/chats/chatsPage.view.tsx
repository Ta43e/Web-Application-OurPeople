import { FC, memo } from "react";
import { UserInfo } from "../../../store/reducers/all/user-slice";
import { Column } from "../../../components/column/column";
import { Link } from "react-router-dom";
import { Text } from "../../../components/text";
import { theme } from "../../../themes/theme";
import Header from "../../../components/header/Header";
import { Avatar } from "@nextui-org/react";

export type ChatsViewProps = {
  likedUsers: UserInfo[];
  deleteChat: (userId: string) => Promise<void>; // Функция для удаления чата
  openChat: (userId: string) => void;  // Функция для открытия чата
};

export const LikeView: FC<ChatsViewProps> = memo(
  ({ likedUsers, deleteChat, openChat }) => {
    return (
      <>
        <Header />
        <Column
          style={{
            padding: "80px",
          }}
        >
          {likedUsers.length > 0 ? (
            likedUsers.map((user, index) => (
              <Column
                key={index}
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link
                  to={`/user/${user._id}`} // Путь на страницу пользователя
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                <Avatar isBordered radius="sm" src={user.mainPhoto || undefined} />


                  <Column padding={10}>
                    <Text themeFont={theme.fonts.m1}>
                      Name: {user.firstName}
                    </Text>
                  </Column>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteChat(user._id)}
                  >
                    Delete Chat
                  </button>
                  <button
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#1890ff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => openChat(user._id)}
                  >
                    Open Chat
                  </button>
                </div>
              </Column>
            ))
          ) : (
            <Text themeColor="gray" themeFont={theme.fonts.m1}>
              No users found
            </Text>
          )}
        </Column>
      </>
    );
  }
);
