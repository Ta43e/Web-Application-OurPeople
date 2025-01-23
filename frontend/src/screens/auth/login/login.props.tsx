import { useNavigate } from 'react-router';

export type LoginProps = {

};

export type GoogleProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const login = (props?: LoginProps) => {
        navigate('/login', { state: props });
    };

    return login;
};


export const useLoginGoogle = () => {

    const navigate = useNavigate();
    const loginGoogle = (props?: GoogleProps) => {
        navigate('/user', { state: props });
    };

    return loginGoogle;
};