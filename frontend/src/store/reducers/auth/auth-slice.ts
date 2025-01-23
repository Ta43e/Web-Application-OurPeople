import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import { AppDispatch } from "../..";

export interface AuthState {
  isAuth: boolean;
  isAuthInProgress: boolean;
  isAdmin: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuth: true,
  isAuthInProgress: false,
  isAdmin: false,
  error: null,
};


export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const resp = await authApi.refreshToken();
      localStorage.setItem("accessToken", resp.token);
      return true;
    } catch (err: any) {
      console.error("accessToken error:", err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Ошибка проверки авторизации");
    }
  }
);


export const checkAdmin = (onSuccess?: () => void) => {
    return (dispatch: AppDispatch) => 
        authApi.checkAdmin()
            .then((response) => {
                dispatch(authSlice.actions.fetchAdminAction(response.isAdmin));
                if (onSuccess !== undefined) onSuccess();
            })
  };

  export const checkBlock = (onSuccess?: () => void) => {
    return (dispatch: AppDispatch) => 
        authApi.checkAdmin()
            .then((response) => {
                dispatch(authSlice.actions.fetchAdminAction(response.isAdmin));
                if (onSuccess !== undefined) onSuccess();
            })
  };

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authApi.logout();
      localStorage.removeItem("accessToken");
      return false; 
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Ошибка выхода");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchAdminAction(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isAuthInProgress = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isAuthInProgress = false;
        state.isAuth = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthInProgress = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isAuthInProgress = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthInProgress = false;
        state.isAuth = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthInProgress = false;
        state.error = action.payload as string;
      })
  },
});

export default authSlice.reducer;
