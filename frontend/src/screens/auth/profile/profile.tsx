import { FC, memo, useCallback, useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { getProfile, updateProfile, profileSlice } from "../../../store/reducers/all/profile-slice";
import { ProfilePageView } from "./profilePage.view";
import { ProfileProps } from "./profile.props";
import { userApi } from "../../../api/user/usersMethod";
import { useNavigate } from "react-router";

export const Profile: FC<ProfileProps> = memo(() => {
    const profileState = useTypedSelector(state => state.profile);
    const { setUserFirstName } = profileSlice.actions;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
            dispatch(getProfile());
    }, [dispatch]);

    const updateProfileUsers = (profileState: any) => {
        dispatch(updateProfile(profileState));
    };

    const handleFirstNameChange = useCallback((newFirstName: string) => {
 
        dispatch(setUserFirstName(newFirstName));
    }, [dispatch, setUserFirstName]);

    const handleDescriptionChange = (newDescription: string) => {
        dispatch(profileSlice.actions.setUserDescription(newDescription));
    };

    const handleAgeChange = (newAge: number) => {
        dispatch(profileSlice.actions.setUserAge(newAge));
    };

    const handleLocationChange = (newLocation: string) => {
        dispatch(profileSlice.actions.setUserLocation(newLocation));
    };
    const handlePurposeChange = (newPurpose: string[]) => {
        dispatch(profileSlice.actions.setUserPurpose(newPurpose));
    };
    const handlePhotoChange = (newPhotos: string[]) => {
        dispatch(profileSlice.actions.setUserPhotos(newPhotos));
    };
    const handleMainPhotoChange = (newMainPhotos: string) => {
        dispatch(profileSlice.actions.setUserMainPhoto(newMainPhotos));
    };

    const handleDeleteProfile = async () => {
        await userApi.deleteProfile(); 
        navigate(`/login`);
    };
    
    if (profileState.error) {
        return <div>Error: {profileState.error}</div>;
    }

    if (profileState.user === null) {
        return <div>No user information available</div>;
    }

    return (
        <ProfilePageView
          
            user={profileState.user}
            error={null}
            updateProfileUsers={updateProfileUsers}
            onFirstNameChange={handleFirstNameChange}
            onDescriptionChange={handleDescriptionChange}
            onAgeChange={handleAgeChange}
            onLocationChange={handleLocationChange}
            onPurposeChange={handlePurposeChange}
            onPhotosChange={handlePhotoChange}
            onMainPhotoChange={handleMainPhotoChange}
            onDeleteProfile={handleDeleteProfile}
        />
    );
});
