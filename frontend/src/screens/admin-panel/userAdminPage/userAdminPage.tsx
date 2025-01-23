import { FC, memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { fetchUser } from "../../../store/reducers/all/user-slice";
import { UserAdminPageView } from "./userAdminPage.view";
import { getProfile } from "../../../store/reducers/all/profile-slice";
import { adminApi } from "../../../api/admin-api";

export const UserAdminPage: FC = memo(() => {
    const { id } = useParams(); 
    const userState = useTypedSelector((state) => state.user);
    const profileState = useTypedSelector((state) => state.profile);
    const dispatch = useAppDispatch();
    const [banMessage, setBanMessage] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(getProfile());
            dispatch(fetchUser(id));
            adminApi
                .getInfoAboutBannedUser(id)
                .then((data) => {
                    setBanMessage(data);
                })
                .catch((error) => {
                    setBanMessage("");
                });
        }
    }, [id, dispatch]);

    const refreshUser = () => {
        if (id) {
            dispatch(fetchUser(id));
        }
    };

    if (userState.error || profileState.error) {
        return <div>Error: {userState.error || profileState.error}</div>;
    }

    if (!userState.user) {
        return <div>Loading user...</div>;
    }

    if (!profileState.user) {
        return <div>Loading profile...</div>;
    }

    return (
        <UserAdminPageView
            user={userState.user}
            banMessage={banMessage}
            refreshUser={refreshUser}
        />
    );
});
