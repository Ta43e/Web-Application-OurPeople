import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { authApi } from "../../api/auth/auth-api";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const adminStatus = await authApi.checkAdmin();
        setIsAdmin(adminStatus.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
  }, []);

  if (isAdmin === null) {
    return <Spinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/user" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
