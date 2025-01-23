import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { RootState } from "../reducers/index";
import { checkAuth } from "../reducers/auth/auth-slice";
import { useAppDispatch } from "./hooks";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { adminApi } from "../../api/admin-api";
import { authApi } from "../../api/auth/auth-api";


const PrivateRoute = () => {
  const dispatch = useAppDispatch();
  const [isBanned, setIsBanned] = useState<boolean | null>(null);


  const { isAuth, isAuthInProgress} = useTypedSelector((state: RootState) => state.auth);
  useEffect(() => {
    const fetchBannedStatus = async () => {
      try {
        const ban = await adminApi.checkBanned();
        setIsBanned(ban.isBanned); 
      } catch (error) {
        setIsBanned(false);
      }
    }; 
    fetchBannedStatus();
    if (!isAuth) {


      dispatch(checkAuth());
    }
  }, [dispatch, isAuth]);

  if (isAuthInProgress) {
    return (
      <div
        className="flex gap-4"
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }


  if (isBanned) {
    return <Navigate to="/banPage" replace />;
  }
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  authApi.checkAdmin().then((adminStatus) => {
    console.log(adminStatus);
    if (adminStatus) <Navigate to="/admin" replace />;
  });

  return <Outlet />;
};

export default PrivateRoute;
