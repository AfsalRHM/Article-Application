import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export const IsNotLogin = () => {
  const userMail = useSelector((state: RootState) => state.user.userMail);
  return userMail ? <Navigate to="/" /> : <Outlet />;
};

export const IsLogin = () => {
  const userMail = useSelector((state: RootState) => state.user.userMail);
  return userMail ? <Outlet /> : <Navigate to="/auth" />;
};
