import { useNavigate } from 'react-router';

export type NotificationPageProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const notificationPage = (props?: NotificationPageProps) => {
        navigate('/notifications', { state: props });
    };

    return notificationPage;
};