import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { RootState } from "~/types/state";

interface Props {
    children: React.ReactNode;
}

const RoleBaseRoute = (props: Props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector((state: RootState) => state.account.user);
    const userRole = user?.role;

    if (isAdminRoute && userRole === 'ADMIN' ||
        !isAdminRoute && (userRole === 'USER' || userRole === 'ADMIN')
    ) {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props: Props) => {
    // Tạm thời cho phép truy cập tất cả các route
    return <>{props.children}</>;

    /* Code phân quyền (đã comment lại)
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated)

    return (
        <>
            {isAuthenticated === true ?
                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                :
                <Navigate to='/login' replace />
            }
        </>
    )
    */
}

export default ProtectedRoute;

