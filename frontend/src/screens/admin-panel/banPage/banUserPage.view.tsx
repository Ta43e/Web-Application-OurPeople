import { FC, memo } from 'react';
import { UserInfo } from '../../../store/reducers/all/profile-slice';
import { Button } from '@nextui-org/react';
import { Text } from '../../../components/text';
import { theme } from '../../../themes/theme';


export type BannedUserViewProps = {
  user: UserInfo;
  message: string;
  goLogin: () => void;
};

export const BannedUserPageView: FC<BannedUserViewProps> = memo(({user, message, goLogin }) => {
  return (
    <div style={{ textAlign: 'center', padding: '200px' }}>
        <Text themeFont={theme.fonts.h1}>Админитсрация заблокировала вашу страницу</Text>
      <Text themeFont={theme.fonts.h1}>Name: {user.firstName}</Text>
      <Text themeFont={theme.fonts.h1}>Email: {user.email}</Text>
      <Text themeFont={theme.fonts.h1}>Причина бана: {message}</Text>
      <Button color="primary" onClick={goLogin} style={{ marginTop: '20px' }}>
        Go to Login
      </Button>
    </div>
  );
});
