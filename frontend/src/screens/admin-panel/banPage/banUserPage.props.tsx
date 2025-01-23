import { useNavigate } from 'react-router';

export type BanUserProps = {

};

export const BanUserPage = () => {

    const navigate = useNavigate();
    const banUserPage = (props?: BanUserProps) => {
        navigate('/banPage', { state: props });
    };

    return banUserPage;
};
