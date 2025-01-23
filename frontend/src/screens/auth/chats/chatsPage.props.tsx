import { useNavigate } from 'react-router';

export type ChatsPageProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const chatsPage = (props?: ChatsPageProps) => {
        navigate('/chats', { state: props });
    };

    return chatsPage;
};