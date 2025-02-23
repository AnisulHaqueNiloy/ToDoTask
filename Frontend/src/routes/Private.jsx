import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import Loading from "../Loading";
import { AuthContext } from "../authprovider/AuthProvider";

const Private = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading></Loading>;
  }
  if (user) {
    return children;
  }
  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};

export default Private;
