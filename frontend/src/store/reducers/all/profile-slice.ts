    import { PayloadAction, createSlice } from "@reduxjs/toolkit";
    import { AppDispatch } from "../..";
    import { userApi } from "../../../api/user/usersMethod";
import { adminApi } from "../../../api/admin-api";

    export type UserInfo = {
        _id: string;
        email: string;
        firstName: string;
        description: string;
        sex: string;
        passwordHash: string;
        age: number;
        purpose: string[];
        mainPhoto: string;
        photos: string[];
        location: string;
        mylikes: string[];
        blocked: string[];
    };

    export type ProfileState = {
        user: UserInfo | null;
        error: string | null;
        notification: string | null;
    };

    const initialState: ProfileState = {
        error: null,
        user: null,
        notification: null,
    };

    export const profileSlice = createSlice({
        name: "profile",
        initialState,
        reducers: {
            setUser(state, action: PayloadAction<UserInfo | null>) {
                state.user = action.payload;
            },
            setError(state, action: PayloadAction<string | null>) {
                state.error = action.payload;
            },
            setUserInfo(state, action: PayloadAction<UserInfo | null>) {
                state.user = action.payload;
            },
            setErrorValue(state, action: PayloadAction<string | null>) {
                state.error = action.payload;
            },
            setUserFirstName(state, action: PayloadAction<string>) {
                if (state.user) state.user.firstName = action.payload;
            },
            setUserDescription(state, action: PayloadAction<string>) {
                if (state.user) state.user.description = action.payload;
            },
            setUserSex(state, action: PayloadAction<string>) {
                if (state.user) state.user.sex = action.payload;
            },
            setUserAge(state, action: PayloadAction<number>) {
                if (state.user) state.user.age = action.payload;
            },
            setUserPurpose(state, action: PayloadAction<string[]>) {
                if (state.user) state.user.purpose = action.payload;
            },
            setUserMainPhoto(state, action: PayloadAction<string>) {
                if (state.user) state.user.mainPhoto = action.payload;
            },
            setUserPhotos(state, action: PayloadAction<string[]>) {
                if (state.user) state.user.photos = action.payload;
            },
            setUserLocation(state, action: PayloadAction<string>) {
                if (state.user) state.user.location = action.payload;
            },
            updateLikes(state, action: PayloadAction<string[]>) {
                if (state.user) {
                    state.user.mylikes = action.payload;
                }
            },
            updateBlocked(state, action: PayloadAction<string[]>) {
                if (state.user) {
                    state.user.blocked = action.payload;
                }
            },
            setCountNotification(state, action: PayloadAction<string>) {
              if (state.user) {
                state.notification = action.payload
              }
            }
        },
    });


    export const getProfile = ( onError?: () => void) => {
        return (dispatch: AppDispatch) => {
            userApi.getProfile()
                .then(response => {
                    console.log(response);
                    dispatch( profileSlice.actions.setUser(response.user));
                    dispatch( profileSlice.actions.setCountNotification(response.notificationCount));
                })
                .catch((err) => {
                    dispatch(profileSlice.actions.setError("Failed to load users"));
                    if (onError) onError();
                });
        };
    };

    export const updateProfile = (profile: any, onError?: () => void) => {
        return (dispatch: AppDispatch) => {
            if (profile){
                userApi.updateProfile(profile)
                .then(response => {
                    dispatch(profileSlice.actions.setUser(response));
                })
                .catch((err) => {
                    dispatch(profileSlice.actions.setError("Failed to load users"));
                    if (onError) onError();
                });
            }
            else{
                dispatch(profileSlice.actions.setError("Failed to load users"));
                if (onError) onError();
            }

        };
    };

    export const likeUser = (userId: string) => {
        return async (dispatch: AppDispatch, getState: () => { profile: ProfileState }) => {
          try {
            await userApi.likeIt(userId);
            const currentUser = getState().profile.user;
            console.log(currentUser);
            if (currentUser) {
              dispatch(profileSlice.actions.updateLikes([...currentUser.mylikes, userId]));
            }
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to like user"));
          }
        };
      };
      
      export const unLikeUser = (userId: string) => {
        return async (dispatch: AppDispatch, getState: () => { profile: ProfileState }) => {
          try {
            await userApi.removeLike(userId);
            const currentUser = getState().profile.user;
            if (currentUser) {
              dispatch(profileSlice.actions.updateLikes(currentUser.mylikes.filter((id) => id !== userId)));
            }
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to unlike user"));
          }
        };
      };
      
      export const blockUser = (userId: string) => {
        return async (dispatch: AppDispatch, getState: () => { profile: ProfileState }) => {
          try {
            await userApi.blockUser(userId);
            const currentUser = getState().profile.user;
            if (currentUser) {
              dispatch(profileSlice.actions.updateBlocked([...currentUser.blocked, userId]));
            }
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to block user"));
          }
        };
      };
      
      export const unblockUser = (userId: string) => {
        return async (dispatch: AppDispatch, getState: () => { profile: ProfileState }) => {
          try {
            await userApi.unBlockUser(userId);
            const currentUser = getState().profile.user;
            if (currentUser) {
              dispatch(profileSlice.actions.updateBlocked(currentUser.blocked.filter((id) => id !== userId)));
            }
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to unblock user"));
          }
        };
      };


      // ADMIN FUNCTION
      export const banUser = (userId: string, message: string) => {
        return async (dispatch: AppDispatch) => {
          try {
            console.log("message!!!" + message)
            await adminApi.bannedUser(userId, message);
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to block user"));
          }
        };
      };

      export const unBanUser = (userId: string) => {
        return async (dispatch: AppDispatch) => {
          try {
            await adminApi.unBanUser(userId);
          } catch (error) {
            dispatch(profileSlice.actions.setError("Failed to unblock user"));
          }
        };
      };
    export default profileSlice.reducer;
