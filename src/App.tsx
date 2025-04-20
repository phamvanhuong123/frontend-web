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
import Home from './layout/client/Home/index';
import RegisterPage from './pages/client/register';
import { callFetchAccount } from './services/axios.user';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './layout/client/Loading';
import NotFound from './layout/client/NotFound';
import ProtectedRoute from './layout/client/ProtectedRoute/index';
import './styles/global.scss';
import './styles/global.scss';
import OrderPage from './pages/client/order';
import HistoryPage from './pages/client/history';
import ProductPage from './pages/client/product';
import LayoutDefault from './layout/admin/LayoutDefault/LayoutDefault';
import UserManagement from './pages/admin/UserManagement/UserManagement';
import ManufactureManagement from './pages/admin/ManufactureManagement/ManufactureManagement';
import ProductManagement from './pages/admin/ProductManagement/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement/OrderManagement';

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
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data));
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
      element: (
        <ProtectedRoute>
          <LayoutDefault />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          path: "users",
          element: (
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "manufactures",
          element: (
            <ProtectedRoute>
              <ManufactureManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "products",
          element: (
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          ),
        },
      ],
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
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Layout />,
  //     errorElement: <NotFound />,
  //     children: [
  //       { index: true, element: <Home /> },
  //       { path: "contact", element: <ContactPage /> },
  //       { path: "product/:slug", element: <ProductPage /> },
  //       { path: "order", element: <OrderPage /> }, // Bỏ ProtectedRoute
  //       { path: "history", element: <HistoryPage /> }, // Bỏ ProtectedRoute
  //     ],
  //   },
  //   {
  //     path: "/admin",
  //     element: <LayoutDefault />, // Bỏ ProtectedRoute
  //     children: [
  //       { path: "users", element: <UserManagement /> },
  //       { path: "manufactures", element: <ManufactureManagement /> },
  //       { path: "products", element: <ProductManagement /> },
  //       { path: "orders", element: <OrderManagement /> },
  //     ],
  //   },
  //   { path: "/login", element: <LoginPage /> },
  //   { path: "/register", element: <RegisterPage /> },
  // ]);
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
