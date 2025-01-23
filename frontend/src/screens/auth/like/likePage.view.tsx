import { FC, memo } from "react";
import { UserInfo } from "../../../store/reducers/all/user-slice";
import { Column } from "../../../components/column/column";
import { Link } from "react-router-dom";
import { Text } from '../../../components/text';
import { theme } from '../../../themes/theme';
import Header from "../../../components/header/Header";

export type LikeViewProps = {
    likedUsers: UserInfo[];
};

export const LikeView: FC<LikeViewProps> = memo(({ likedUsers }) => {
    return (
        <>
            <Header />
            <Column
                style={{
                    padding: '80px',
                    alignItems: 'center',
                }}
            >
                {likedUsers.length > 0 ? (
                    likedUsers.map((user, index) => (
                        <Link
                            to={`/user/${user._id}`} // Путь на страницу пользователя
                            key={index}
                            style={{ 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', // Центрирование по горизонтали
                                width: '100%', // Занимаем всю ширину родительского элемента
                                marginBottom: '20px', // Отступ между элементами
                            }}
                        >
                            <img
                                src={user.mainPhoto || 'https://via.placeholder.com/50'}
                                alt={`${user.firstName}'s photo`}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginRight: 10,
                                }}
                            />
                            <Column
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ccc',
                                    cursor: 'pointer', // Курсор в виде руки при наведении
                                    textAlign: 'center', // Центрирование текста
                                }}
                            >
                                <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
                                <Text themeFont={theme.fonts.m1}>Email: {user.email}</Text>
                                <Text themeFont={theme.fonts.m1}>Purpose: {user.purpose[0]}</Text>
                            </Column>
                        </Link>
                    ))
                ) : (
                    <Text themeColor="gray" themeFont={theme.fonts.m1}>No users found</Text>
                )}
            </Column>
        </>
    )
});
