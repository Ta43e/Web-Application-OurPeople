import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { authApi } from "../../../api/auth/auth-api";
import { profileSlice } from "../all/profile-slice";


export type LoginState = {
    email: string;
    password: string;
    loading: "idle" | "loading" | "success" | "error";
    error: string | null;
};

const initialState: LoginState = {
    email: "",
    password: "",
    loading: "idle",
    error: null,
};


export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
        fetchLoginErrorActionCreater(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = "error";
        },
        fetchLoginUserActionCreater(state) {
            state.loading = "loading";
        },
        fetchLoginSuccessActionCreater(state) {
            state.loading = "success";
            state.error = null;
            state.email = '';
            state.password = '';
            state.loading = 'idle';
        },
        setemailActionCreater(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setPasswordActionCreater(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        reset(state){
            state.error = null;
            state.email = '';
            state.password = '';
            state.loading = 'idle';
        }
    }
});

export const loginActionCreater = (email: string, password: string, onSuccess?: () => void) => {
    return (dispatch: AppDispatch) => {
        dispatch(loginSlice.actions.fetchLoginUserActionCreater());
        
        authApi.loginBase(email, password)
            .then((response) => {
                localStorage.setItem('accessToken', response.accessToken);
                dispatch(loginSlice.actions.fetchLoginSuccessActionCreater());
                dispatch(profileSlice.actions.setUser(response.user));
                if (onSuccess !== undefined) onSuccess();
            })
            .catch((err: any) => {
                dispatch(loginSlice.actions.fetchLoginErrorActionCreater(err.response?.data.message));
            });
    };
};

export default loginSlice.reducer;