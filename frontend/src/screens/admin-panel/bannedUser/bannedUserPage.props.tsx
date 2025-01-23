import { useNavigate } from 'react-router';

export type BannedUserProps = {

};

export const BannedUserPage = () => {

    const navigate = useNavigate();
    const bannedUserPage = (props?: BannedUserProps) => {
        navigate('/bannedUserPage', { state: props });
    };

    return bannedUserPage;
};
