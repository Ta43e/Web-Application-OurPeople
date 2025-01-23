import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../..";
import { userApi } from "../../../api/user/usersMethod";

export type NotificationInfo = {
    _id: string;
    sender: string;
    receiver: string;
    message: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
};

export type NotificationsState = {
    notifications: NotificationInfo[];
    error: string | null;
    loading: boolean;
};

const initialState: NotificationsState = {
    notifications: [],
    error: null,
    loading: false,
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<NotificationInfo[]>) {
            state.notifications = action.payload;
        },
        addNotification(state, action: PayloadAction<NotificationInfo>) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter((msg) => msg._id !== action.payload);
        },
        updateNotificationStatus(state, action: PayloadAction<{ _id: string; status: boolean }>) {
            const notification = state.notifications.find(
                (notif) => notif._id === action.payload._id
            );
            if (notification) {
                notification.status = action.payload.status;
            }
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    removeNotification,
    updateNotificationStatus,
    setError,
    setLoading,
} = notificationsSlice.actions;

export const fetchNotifications = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await userApi.getNotification();
            dispatch(setNotifications(response));
        } catch (err) {
            dispatch(setError("Failed to fetch notifications"));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const markNotificationAsRead = (_id: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            await userApi.openNotification(_id);
            dispatch(updateNotificationStatus({ _id, status: true }));
        } catch (err) {
            dispatch(setError("Failed to mark notification as read"));
        }
    };
};

export const deleteNotification = (_id: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            await userApi.deleteNotification(_id);
            dispatch(removeNotification(_id));
        } catch (err) {
            dispatch(setError("Failed to fetch notifications"));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export default notificationsSlice.reducer;
