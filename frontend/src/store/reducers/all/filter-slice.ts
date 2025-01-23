import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { userApi } from "../../../api/user/usersMethod";
import { UserInfo, usersSlice } from "./mainPage-slice";

export type FilterState = {
    minAge: number;
    maxAge: number;
    purpose: string[];
    location: string[];
    sortOrder: string;
    offset: number;
    limit: number;
    searchQuery: string;
    loading: "idle" | "loading" | "success" | "error";
    error: string | null;
    usersList: UserInfo[];
    totalCount: number,
    sex: string,
};

const initialState: FilterState = {
    minAge: 18,
    maxAge: 99,
    purpose: [],
    location: [],
    sortOrder: 'asc',
    offset: 0,
    limit: 8,
    searchQuery: '',
    loading: "idle",
    error: null,
    usersList: [],
    totalCount: 0,
    sex: "женщина",
};

export const filterSlice = createSlice({
    name: "filter",
    initialState: initialState,
    reducers: {
        fetchError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = "error";
        },
        fetchLoading(state) {
            state.loading = "loading";
        },
        fetchSuccess(state) {
            state.loading = "success";
            state.error = null;
        },
        setMinAgeAction(state, action: PayloadAction<number>) {
            state.minAge = action.payload;
        },
        setMaxAgeAction(state, action: PayloadAction<number>) {
            state.maxAge = action.payload;
        },
        setPurposeAction(state, action: PayloadAction<string[]>) {
            state.purpose = action.payload;
        },
        setLocationAction(state, action: PayloadAction<string[]>) {
            state.location = action.payload;
        },
        setSortOrderAction(state, action: PayloadAction<string>) {
            state.sortOrder = action.payload;
        },
        setOffsetAction(state, action: PayloadAction<number>) {
            state.offset = action.payload;
        },
        setLimitAction(state, action: PayloadAction<number>) {
            state.limit = action.payload;
        },
        setSearchQueryAction(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setUsersList(state, action: PayloadAction<UserInfo[]>) {
            state.usersList = action.payload;
        },
        setTotalCount(state, action: PayloadAction<number>) {
            state.totalCount = action.payload;
        },
        setSexAction(state, action: PayloadAction<string>) {
            state.sex = action.payload;
        }
    }
});


export const searchUsers = (filter: FilterState, onSuccess?: () => void) => {
    return (dispatch: AppDispatch) => {
        userApi.search(filter)
          .then((response) => {
            console.log("searchUsers    ")
              dispatch(usersSlice.actions.setUsersList(response));
              if (onSuccess) onSuccess();
          })
          .catch(() => {
              dispatch(filterSlice.actions.fetchError("Not found"));
          });
    }
}


export const getBannedUsers = (filter: FilterState, onSuccess?: () => void) => {
    return (dispatch: AppDispatch) => {
        userApi.getBannedUserWithFiltr(filter)
          .then((response) => {
                console.log("getBannedUsers")
              dispatch(usersSlice.actions.setUsersList(response));
              if (onSuccess) onSuccess();
          })
          .catch(() => {
              dispatch(filterSlice.actions.fetchError("Not found"));
          });
    }
}

export default filterSlice.reducer;
