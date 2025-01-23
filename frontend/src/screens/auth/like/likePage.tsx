import { FC, memo, useCallback, useEffect, useState } from "react";
import { userApi } from "../../../api/user/usersMethod";
import { LikeView } from "./likePage.view";

export const LikePage: FC = memo(() => {


    const [likedUsers, setLikedUsers] = useState([]);


    const getLikeUser = useCallback(async () => {
        try {
            const response = await userApi.getLike(); 
            setLikedUsers(response); 
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, []);

    useEffect(() => {
        getLikeUser(); // Вызываем функцию при монтировании компонента
    }, [getLikeUser]);

    return (
        <LikeView
            likedUsers={likedUsers} // Передаем пользователей в LikeView
        />
    );
});
