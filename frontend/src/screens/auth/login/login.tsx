import { FC, memo, useCallback } from 'react';
import { LoginProps } from './login.props';
import { LoginView } from './login.view';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { loginActionCreater, loginSlice } from '../../../store/reducers/auth/login-slice';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth/auth-api';

export const Login: FC<LoginProps> = memo(() => {
  const loginState = useTypedSelector(state => state.login);
  
  const { setemailActionCreater, setPasswordActionCreater } = loginSlice.actions;
  const dispatch = useAppDispatch();

  const nav = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navLogin = () => {
    nav('/')
  }

  const onSignup = () => {
    nav('/signup')
  }

  const setemail = useCallback((email: string) => {
    dispatch(setemailActionCreater(email));
  }, [dispatch, setemailActionCreater]);

  const setPassword = useCallback((password: string) => {
      dispatch(setPasswordActionCreater(password));
  }, [dispatch, setPasswordActionCreater])


  const onLogin = useCallback(() => {
    dispatch(loginActionCreater(loginState.email, loginState.password, navLogin));
  }, [dispatch, loginState.email,loginState.password,navLogin])

  return (
      <LoginView onSignup={onSignup} onLogin={onLogin} loginState={loginState} setPassword={setPassword} setemail={setemail} onLoginGoogle={authApi.loginGoogle}/>
    );
});
