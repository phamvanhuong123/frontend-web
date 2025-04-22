import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { RootState } from "~/redux/account/accountSlice";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.account);
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.role) {
    return <NotPermitted />;
  }

  switch (user.role) {
    case "ADMIN":
    case "STAFF":
      return <>{children}</>;

    case "CUSTOMER":
      return isAdminRoute ? <NotPermitted /> : <>{children}</>;

    default:
      return <NotPermitted />;
  }
};

export default ProtectedRoute;
