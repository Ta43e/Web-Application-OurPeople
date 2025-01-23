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
    usersList: UserInfo[];
    error: string | null;
    search: string;
};

const initialState: UsersState = {
    error: null,
    usersList: [],
    search: ''
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsersList(state, action: PayloadAction<UserInfo[]>) {
            state.usersList = action.payload;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    }
});

export const { setUsersList, setSearch, setError } = usersSlice.actions;


export const fetchUsersList = (onError?: () => void) => {
    return (dispatch: AppDispatch) => {
        userApi.getUsers() 
            .then(response => {
                dispatch(setUsersList(response));
            })
            .catch((err) => {
                dispatch(setError("Failed to load users"));
                if (onError) onError();
            });
    };
};

export default usersSlice.reducer;
