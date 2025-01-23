import { FC, memo, useCallback, useEffect, useState } from "react";
import { userApi } from "../../../api/user/usersMethod";
import { LikeView } from "./chatsPage.view";
import { useNavigate } from "react-router";

export const ChatsPage: FC = memo(() => {


    const [chatsUsers, setChatsUsers] = useState([]);

    const navigate = useNavigate();
    const getLikeUser = useCallback(async () => {
        try {
            const response = await userApi.getChatsUser(); 
            console.log(response);
            setChatsUsers(response); 
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, []);

    useEffect(() => {
        getLikeUser(); // Вызываем функцию при монтировании компонента
    }, [getLikeUser]);

    const handleDeleteChange = async (_id: string) => {
        await userApi.deleteCahts(_id); 
        getLikeUser();
    };

    const handleOpenChange = useCallback(async (_id: string) => {
        navigate(`/chat/${_id}`);
    }, [navigate]);

    return (
        <LikeView
            likedUsers={chatsUsers}
            deleteChat={handleDeleteChange}
            openChat={handleOpenChange} 
        />
    );
});
