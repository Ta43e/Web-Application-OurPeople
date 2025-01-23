import { useNavigate } from 'react-router';

export type LikePageProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const likePage = (props?: LikePageProps) => {
        navigate('/like', { state: props });
    };

    return likePage;
};