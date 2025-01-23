import { useNavigate } from 'react-router';

export type UserPageProps = {

};

export const useUserPage = () => {

    const navigate = useNavigate();
    const userPage = (props?: UserPageProps) => {
        navigate('/userPage', { state: props });
    };

    return userPage;
};
