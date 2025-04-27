import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Router from "./routes/Router";
import { userApi } from "./services/axios.user";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./layout/client/Loading";
import { ToastContainer } from "react-toastify";

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.account.isLoading);
  const location = useLocation();

  const isPublicRoute = ["/login", "/register", "/"].some((path) =>
    location.pathname.startsWith(path)
  );

  const getAccount = async () => {
    if (isPublicRoute) return;

    try {
      const res = await userApi.callFetchAccount();
      if (res?.data) {
        dispatch(doGetAccountAction(res.data));
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    getAccount();
  }, [location.pathname]);

  if (isLoading && !isPublicRoute) {
    return <Loading />;
  }

  return <>
    <Router />
     <ToastContainer />
  </>;
}
