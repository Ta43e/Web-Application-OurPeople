import { useNavigate } from 'react-router';


export type SignupProps = {

  };
  
export const useSignup = () => {

    const navigate = useNavigate();
    const signup = () => {
        navigate('/signup');
    };

    return signup;
};
