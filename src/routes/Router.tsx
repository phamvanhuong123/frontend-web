import { useRoutes } from "react-router-dom";
import Home from "~/pages/client/Home/Home";
import LayoutClient from "~/layout/client/LayoutDefault/LayoutDefault";
import LayoutDefault from "~/layout/admin/LayoutDefault/LayoutDefault";
import Categories from "~/pages/admin/CategoryManagement/CategoryManagement";
import Dashboard from "~/pages/admin/Dashboard/Dashboard";
import Order from "~/pages/admin/OrderManagement/OrderManagement";
import Products from "~/pages/admin/ProductManagement/ProductManagement";
import Users from "~/pages/admin/UserManagement/UserManagement";
import CreateProduct from "~/pages/admin/ProductManagement/CreateProduct/CreateProduct";
import CreateCategory from "~/pages/admin/CategoryManagement/CreateCategory/CreateCategory";
import EditCategory from "~/pages/admin/CategoryManagement/EditCategory/EditCategory";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        { path: "", element: <Home /> },
      ],
    },
    {
      path: "/admin",
      element: <LayoutDefault />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "users", element: <Users /> },
        { path: "orders", element: <Order /> },
        { path: "products", element: <Products /> },
        { path: "products/create", element: <CreateProduct /> },
        { path: "categories", element: <Categories /> },
        { path: "categories/create", element: <CreateCategory /> },
        { path: "categories/edit/:id", element: <EditCategory /> },
      ],
    },
  ]);
  return routes;
}
