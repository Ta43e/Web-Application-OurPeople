import { FC, memo } from 'react';
import { Column } from '../../../components/column';
import { Spacing } from '../../../components/spacing';
import { Text } from '../../../components/text';
import { UserInfo } from '../../../store/reducers/all/mainPage-slice';
import { theme } from '../../../themes/theme';
import Filter from '../../../components/filter/filter';
import { Link } from 'react-router-dom';
import Header from '../../../components/header/Header';
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import Pagination from '../../../components/pagination/Pagination';

export type MainPageViewProps = {
  usersList: UserInfo[];
  error: string | null;
  getProfile: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const MainPageView: FC<MainPageViewProps> = memo(({ usersList, error, getProfile, currentPage, totalPages, onPageChange }) => {
  return (
    <Column verticalAlign="center" horizontalAlign="center">
      <Header />
      <Filter />
      <Spacing variant="Column" themeSpace={20} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', justifyContent: 'center', alignItems: 'start', width: '100%' }}>
        {usersList.length > 0 ? (
          usersList.map((user, index) => (
            <Card
              key={index}
              isFooterBlurred
              className="border-none"
              radius="lg"
              style={{ maxWidth: '400px', height: "300px", margin: '0 auto' }}
            >
              <Link
                to={`/user/${user._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Image
                  alt={`${user.firstName}'s photo`}
                  className="object-cover"
                  height={400}
                  src={user.mainPhoto !== "" ? user.mainPhoto : 'https://avatars.dzeninfra.ru/get-zen_doc/3770780/pub_5f09c625d4876d705c31f26d_5f09c6cf0e899d15b130a030/scale_1200'}
                  width={300}
                />

                <CardFooter
                  className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
                    <Text themeFont={theme.fonts.m1}>Email: {user.email}</Text>
                    <Text themeFont={theme.fonts.m1}>Purpose: {user.purpose[0]}</Text>
                  </div>
                  <Button
                    className="text-tiny text-white bg-black/20"
                    color="default"
                    radius="lg"
                    size="sm"
                    variant="flat"
                  >
                    View Profile
                  </Button>
                </CardFooter>
              </Link>
            </Card>
            
          ))
        ) : (
          <Text themeColor="gray" themeFont={theme.fonts.m1}>No users found</Text>
        )}
      </div>
      <Spacing variant="Column" themeSpace={20} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Column>
  );
});
