import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { RootState } from "~/redux/account/accountSlice";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.account.user);
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);

    const isAdminRoute = location.pathname.startsWith("/admin");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ADMIN: toàn quyền
    if (user?.role === "ADMIN") {
        return <>{children}</>;
    }

    // USER: chỉ được vào route client, cấm /admin
    if (user?.role === "USER") {
        if (isAdminRoute) return <NotPermitted />;
        return <>{children}</>;
    }

    // Nếu role không hợp lệ
    return <NotPermitted />;
};

export default ProtectedRoute;
