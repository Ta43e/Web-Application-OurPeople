import { FC, memo } from 'react';
import { Input } from '../../../components/input';
import { Column } from '../../../components/column';
import { Spacing } from '../../../components/spacing';
import { Button } from '../../../components/button';
import { LoginState } from '../../../store/reducers/auth/login-slice';
import { Text } from '../../../components/text';
import { theme } from '../../../themes/theme';
import { Image } from '../../../components/image';
import styled from 'styled-components';

import { WrapperLoginAndSignup, WrapperThenLoginAndSignup } from './login.styled';

export type LoginViewProps = {
  setemail: (email: string) => void;
  setPassword: (password: string) => void;
  onSignup: () => void;
  onLogin: () => void;
  onLoginGoogle: () => void;
  loginState: LoginState;
};

const StyledButton = styled(Button)`
  border-radius: 20px;
  margin-bottom: 10px;
  &:hover {
    background-color: #ff4d4d; /* Slightly darker red on hover */
  }
`;

const SignupLink = styled(Text)`
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #ffd700; /* Gold color on hover */
  }
`;

export const LoginView: FC<LoginViewProps> = memo(({ setemail, onSignup, setPassword, onLogin, onLoginGoogle, loginState }) => {
  return (
    <WrapperLoginAndSignup>
      <WrapperThenLoginAndSignup>
        <Column style={{ height: '100vh' }} verticalAlign='center' horizontalAlign='center'>
          <Input placeholder='email' value={loginState.email} setValue={setemail} />
          <Spacing variant='Column' themeSpace={10} />
          <Input placeholder='password' value={loginState.password} setValue={setPassword} type='password' error={loginState.error} />
          <Spacing variant='Column' themeSpace={10} />
          <StyledButton themeColor='red' borderColor='none' onClick={onLogin} height={40} width={120}>
            <Text themeColor='white' themeFont={theme.fonts.m1}>
              Login
            </Text>
          </StyledButton>
          <StyledButton themeColor='red' borderColor='none' onClick={onLoginGoogle} height={40} width={120}>
            <Text themeColor='white' themeFont={theme.fonts.m1}>
              Google
            </Text>
          </StyledButton>
          <Spacing variant='Column' themeSpace={5} />
          <SignupLink onClick={onSignup} themeColor='red' themeFont={theme.fonts.m1}>
            Sign-up
          </SignupLink>
        </Column>
      </WrapperThenLoginAndSignup>
    </WrapperLoginAndSignup>
  );
});
