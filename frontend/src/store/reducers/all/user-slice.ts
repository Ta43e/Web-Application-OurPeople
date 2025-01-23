import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { userApi } from "../../../api/user/usersMethod";

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
    isBanned: boolean;
};

export type UsersState = {
    user: UserInfo | null;
    error: string | null;
    search: string;
};

const initialState: UsersState = {
    error: null,
    user: null,
    search: ''
};

export const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserInfo>) {
            state.user = action.payload;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        updateUserProperty(state, action: PayloadAction<Partial<UserInfo>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                console.log(state.user);
            }
        }
    }
});

export const { setUser,setError, updateUserProperty  } = usersSlice.actions;


export const fetchUser = (_id: string, onError?: () => void) => {
return (dispatch: AppDispatch) => {
    userApi.getById(_id) 
        .then(response => {
            dispatch(setUser(response));
        })
        .catch((err) => {
            dispatch(setError("Failed to load users"));
            if (onError) onError();
        });
    };
};

export default usersSlice.reducer;
