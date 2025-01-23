import { useNavigate } from 'react-router';

export type ProfileProps = {

};

export const useProfile = () => {

    const navigate = useNavigate();
    const profile = (props?: ProfileProps) => {
        navigate('/profile', { state: props });
    };

    return profile;
};
