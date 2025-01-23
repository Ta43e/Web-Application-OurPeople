import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { authApi } from "../../../api/auth/auth-api";
import { CreateUserDto } from "../all/types";

export type SingupState = {
    email: string;
    firstName: string;
    description: string;
    sex: string;
    password: string;
    confirmPassword: string;
    age: number | null;
    purpose: string[];
    mainPhoto: string;
    photos: string[];
    location: string;
    loading: "idle" | "loading" | "success" | "error";
    error: string | null;
};

const initialState: SingupState = {
    email: "",
    firstName: "",
    description: "",
    sex: "",
    password: "",
    confirmPassword: "",
    age: null,
    purpose: [],
    mainPhoto: "",
    photos: [],
    location: "",
    loading: "idle",
    error: null,
};

export const singupSlice = createSlice({
    name: "singup",
    initialState,
    reducers: {
        fetchSignupError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = "error";
        },
        fetchSignupUser(state) {
            state.loading = "loading";
        },
        fetchSignupSuccess(state) {
            state.loading = "success";
            state.error = null;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setFirstName(state, action: PayloadAction<string>) {
            state.firstName = action.payload;
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSex(state, action: PayloadAction<string>) {
            state.sex = action.payload;
        },
        setPassword(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        setConfirmPassword(state, action: PayloadAction<string>) {
            state.confirmPassword = action.payload;
        },
        setAge(state, action: PayloadAction<number>) {
            state.age = action.payload;
        },
        setPurpose(state, action: PayloadAction<string[]>) {
            state.purpose = action.payload;
        },
        setMainPhoto(state, action: PayloadAction<string>) {
            state.mainPhoto = action.payload;
        },
        setPhotos(state, action: PayloadAction<string[]>) {
            state.photos = action.payload;
        },
        setLocation(state, action: PayloadAction<string>) {
            state.location = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    }
});

export const signupAction = (createUserDto: CreateUserDto, onSuccess?: () => void) => {
    return async (dispatch: AppDispatch) => {
        if (createUserDto.email === '' || createUserDto.email.length < 10) {
            dispatch(singupSlice.actions.fetchSignupError('Email should be between 1 and 10 characters'));
            return;
        }
        dispatch(singupSlice.actions.fetchSignupUser());
        
        try {
            const response = await authApi.register(createUserDto);
            localStorage.setItem('accessToken', response.token);
            dispatch(singupSlice.actions.fetchSignupSuccess());
            onSuccess && onSuccess();

        } catch (error: any) {
            dispatch(singupSlice.actions.fetchSignupError(error.response?.data.message || 'Signup failed'));
        }
    };
}

export default singupSlice.reducer;
