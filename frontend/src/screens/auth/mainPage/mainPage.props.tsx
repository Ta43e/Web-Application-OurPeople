import { useNavigate } from 'react-router';

export type MainPageProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const mainPage = (props?: MainPageProps) => {
        navigate('/user', { state: props });
    };

    return mainPage;
};