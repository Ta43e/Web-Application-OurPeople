import { FC, memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { fetchUser } from "../../../store/reducers/all/user-slice";
import { UserPageView } from "./userPage.view";
import { getProfile } from "../../../store/reducers/all/profile-slice";

export const UserPage: FC = memo(() => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const userState = useTypedSelector(state => state.user);
    const profileState = useTypedSelector(state => state.profile);
    const dispatch = useAppDispatch();
    let isBlockedMe = false;
    if (profileState.user && userState.user) {
        isBlockedMe = userState.user.blocked.includes(profileState.user._id);
    }


    useEffect(() => {
        if (id) {
            dispatch(getProfile());
            dispatch(fetchUser(id));
        }
    }, [id, dispatch]);
    
    if (userState.error || profileState.error) {
        return <div>Error: {userState.error || profileState.error}</div>;
    }
    
    if (!userState.user) {
        return <div>Loading user...</div>;
    }


    if (!profileState.user) {
        return <div>Loading profile...</div>;
    }

    const handleMessageClick = () => {
        navigate(`/chat/${userState.user?._id}`);
      };

    return <UserPageView user={userState.user} profileState={profileState.user} isBlockedMe={isBlockedMe} handleMessageClick={handleMessageClick}/>;
});
