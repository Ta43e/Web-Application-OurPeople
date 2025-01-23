import { FC, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { BannedUserPageView } from "./banUserPage.view";
import { getProfile } from "../../../store/reducers/all/profile-slice";
import { adminApi } from "../../../api/admin-api";

export const BanUserPage: FC = memo(() => {
    const profileState = useTypedSelector(state => state.profile);
    const [banMessage, setBanMessage] = useState("");
       const dispatch = useAppDispatch();
       const navigate = useNavigate();
       useEffect(() => {
        if (profileState.user) {
          adminApi.getInfoAboutBannedUser(profileState.user?._id)
            .then((data) => {
                setBanMessage(data);
            })
            .catch((error) => {
                setBanMessage("");
            });
          }
          dispatch(getProfile());
       }, [dispatch, profileState.user]);
   
       const handleGoLogin = async () => {
           navigate(`/login`);
       };
       
       if (profileState.error) {
           return <div>Error: {profileState.error}</div>;
       }
   
       if (profileState.user === null) {
           return <div>No user information available</div>;
       }
   
    return (
      <BannedUserPageView user={profileState.user} message={banMessage} goLogin={handleGoLogin}/>
    );
});

