import { FC, memo, useCallback, useEffect } from "react";
import { NotificationView } from "./notificationPage.view";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { deleteNotification, fetchNotifications, markNotificationAsRead } from "../../../store/reducers/all/notification-slice";

export const NotificationPage: FC = memo(() => {
    const notificationState = useTypedSelector(state => state.notification); 
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(fetchNotifications()); 
    }, [dispatch]);

    
    const handleStatusChange = (_id: string, status: boolean) => {
        dispatch(markNotificationAsRead(_id));
    };

    const handleDeleteNotifications = useCallback((_id: string) => {
        dispatch(deleteNotification(_id));
    }, [dispatch]);

    return (
        <NotificationView
            notifications={notificationState.notifications}
            handleStatusChange={handleStatusChange} 
            handleDeleteNotifications={handleDeleteNotifications} 
        />
    );
});
