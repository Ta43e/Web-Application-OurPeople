import { FC, memo, useCallback } from "react";
import { Column } from "../../../components/column";
import { Spacing } from "../../../components/spacing";
import { Text } from "../../../components/text";
import { theme } from "../../../themes/theme";
import { Button as NextUIButton, Image } from "@nextui-org/react"; // Импорт NextUI Button
import Carousel from "../../../components/carousel/carousel";
import { useAppDispatch } from "../../../hooks/use-typed-selector";
import { likeUser, unLikeUser, blockUser, unblockUser, UserInfo } from "../../../store/reducers/all/profile-slice";
import Header from "../../../components/header/Header";
import { socket } from "../../../ws/chat";

interface User {
  _id: string;
  firstName: string;
  email: string;
  age: number;
  purpose: string[];
  mainPhoto: string;
  photos: string[];
  location: string;
  description: string;
}

export type UserPageViewProps = {
  user: User;
  profileState: UserInfo;
  isBlockedMe: boolean;
  handleMessageClick: () => void;
};

export const UserPageView: FC<UserPageViewProps> = memo(({ user, profileState, isBlockedMe, handleMessageClick }) => {
  const dispatch = useAppDispatch();

  const isLiked = profileState.mylikes.includes(user._id);
  const isBlocked = profileState?.blocked.includes(user._id);
  socket.emit('user:joinYourRoom', { owner: user._id });
  const handleLikeToggle = useCallback(() => {
    if (isLiked) {
      dispatch(unLikeUser(user._id));
    } else {
      dispatch(likeUser(user._id));

      socket.emit('like', {
        likedUserId: user._id,
        liker: {
          _id: profileState._id,
          firstName: profileState.firstName,
        },
      });
    }
  }, [dispatch, isLiked, user._id, profileState]);

  const handleBlockToggle = useCallback(() => {
    if (isBlocked) {
      dispatch(unblockUser(user._id)); 
    } else {
      dispatch(blockUser(user._id)); 
    }
  }, [dispatch, isBlocked, user._id]);

  if (isBlockedMe) {
    return (
      <Column style={{ height: "100vh", justifyContent: "center", alignItems: "center" , paddingLeft: "25%", paddingRight: "25%"}}>
        <Image
          src={user.mainPhoto || "https://via.placeholder.com/150"}
          alt={`${user.firstName}`}
          width={150}
          height={150}
          style={{ borderRadius: "50%" }}
        />
        <Spacing themeSpace={20} variant={"Column"} />
        <Text themeFont={theme.fonts.m1}>
          Пользователь ограничил доступ к своей странице.
        </Text>
        <Spacing themeSpace={10} variant={"Column"} />

        {isBlocked ? (
          <>
            <Text themeFont={theme.fonts.m1}>
              Вы его тоже заблокировали, можно разблокировать.
            </Text>
            <Spacing themeSpace={20} variant={"Column"} />
            <NextUIButton color="success" onClick={handleBlockToggle}>Разблокировать</NextUIButton>
          </>
        ) : (
          <>
            <Text themeFont={theme.fonts.m1}>
              Вы можете заблокировать его тоже.
            </Text>
            <Spacing themeSpace={20} variant={"Column"} />
            <NextUIButton color="danger" onClick={handleBlockToggle}>Заблокировать</NextUIButton>
          </>
        )}

        <Spacing themeSpace={20} variant={"Column"} />
        <Text themeFont={theme.fonts.m1}>Чтобы увидеть его страницу, разблокируйте.</Text>
        <Spacing themeSpace={20} variant={"Column"} />
      </Column>
    );
  }
  
  if (isBlocked) {
    return (
      <Column style={{ height: "100vh", justifyContent: "center", alignItems: "center" , paddingLeft: "25%", paddingRight: "25%"}}>
        <Image
          src={user.mainPhoto || "https://via.placeholder.com/150"}
          alt={`${user.firstName}`}
          width={150}
          height={150}
          style={{ borderRadius: "50%" }}
        />
        <Spacing themeSpace={20} variant={"Column"} />
        <Text themeFont={theme.fonts.m1}>Вы заблокировали данного пользователя.</Text>
        <Spacing themeSpace={10} variant={"Column"} />
        <Text themeFont={theme.fonts.m1}>Чтобы увидеть его страницу, разблокируйте.</Text>
        <Spacing themeSpace={20} variant={"Column"} />
        <NextUIButton color="success" onClick={handleBlockToggle}>Разблокировать</NextUIButton>
      </Column>
    );
  }

  return (
    <>
      <Header />
      <Column style={{ height: "100vh", justifyContent: "center", alignItems: "center", padding: "20px" , paddingLeft: "28%", paddingRight: "28%"}}>
        <Spacing variant="Column" themeSpace={20} />
        <Column style={{ flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <Column>
        <Image
          src={user.mainPhoto || "https://via.placeholder.com/150"}
          alt={`${user.firstName}`}
          width={170}
          height={170}
          style={{
            borderRadius: "50%",
            objectFit: "cover", // Это обеспечит, чтобы изображение не искажалось, а заполнило круг
            marginLeft: "75px",
            marginRight: "2%",
          }}
          />
          <Spacing themeSpace={20} variant={"Column"} />
         </Column>
          <Column>
            <NextUIButton 
              color={isLiked ? "primary" : "secondary"} 
              onClick={handleLikeToggle} 
              style={{ marginBottom: "10px" }}
            >
              {isLiked ? "Remove Like" : "Like"}
            </NextUIButton>
            <NextUIButton 
              color={isBlocked ? "success" : "danger"} 
              onClick={handleBlockToggle} 
              style={{ marginBottom: "10px" }}
            >
              {isBlocked ? "Unblock" : "Block"}
            </NextUIButton>
            <NextUIButton 
              color="warning" 
              onClick={handleMessageClick} 
              style={{ marginBottom: "10px" }}
            >
              Message
            </NextUIButton>
          </Column>

          <Spacing themeSpace={20} variant={"Column"} />
          
          <Column style={{ marginLeft: "20px", textAlign: "left" }}>
            <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
            <Text themeFont={theme.fonts.m1}>Age: {user.age}</Text>
            <Text themeFont={theme.fonts.m1}>Purpose: {user.purpose[0]}</Text>
            <Text themeFont={theme.fonts.m1}>Location: {user.location}</Text>
            <Text themeFont={theme.fonts.m1}>Description: {user.description}</Text>
          </Column>
        </Column>

        <Spacing themeSpace={40} variant={"Column"} />
        <Carousel data={user.photos.length > 0 ? user.photos : ["https://via.placeholder.com/150"]} />
      </Column>
    </>
  );
});
