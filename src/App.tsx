import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ContactPage from './pages/client/contact';
import LoginPage from './pages/client/login';
import { Outlet } from "react-router-dom";
import Header from './layout/client/Header';
import Footer from './layout/client/Footer';
import Home from './layout/client/Home';
import RegisterPage from './pages/client/register';
import { callFetchAccount } from './services/axios.user';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './layout/client/Loading';
import NotFound from './layout/client/NotFound';
import ProtectedRoute from './layout/client/ProtectedRoute';
import './styles/global.scss';
import './styles/global.scss';
import OrderPage from './pages/client/order';
import HistoryPage from './pages/client/history';
import ProductPage from './pages/client/product';
import LayoutDefault from './layout/admin/LayoutDefault/LayoutDefault';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.account.isLoading);

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    try {
      const res = await callFetchAccount();
      if (res && res) {
        dispatch(doGetAccountAction(res));
      }
    } catch (error) {
      console.error("Failed to fetch account:", error);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "product/:slug",
          element: <ProductPage />,
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutDefault />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        || window.location.pathname.startsWith('/product') ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
