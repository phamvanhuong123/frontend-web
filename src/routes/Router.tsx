import { useRoutes } from "react-router-dom";
import Home from "../layout/client/Home";
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
import DetailCategory from "~/pages/admin/CategoryManagement/DetailCategory/DetailCategory";
import CreateUser from "~/pages/admin/UserManagement/CreateUser/CreateUser";
import EditUser from "~/pages/admin/UserManagement/EditUser/EditUser";
import DetailUser from "~/pages/admin/UserManagement/DetailUser/DetailUser";
import ChatPage from "~/pages/admin/ChatManagement/ChatPage";
import CreateManufacture from "~/pages/admin/ManufactureManagement/CreateManufacture/CreateManufacture";
import EditManufacture from "~/pages/admin/ManufactureManagement/EditManufacture/EditManufacture";
import DetailManufacture from "~/pages/admin/ManufactureManagement/DetailManufacture/DetailManufacture";
import DeleteManufacture from "~/pages/admin/ManufactureManagement/DeleteManufacture/DeleteManufacture";
import CreatePostForm from "~/pages/admin/PostManagement/CreatePost/CreatePost";
import EditPost from "~/pages/admin/PostManagement/EditPost/EditPost";
import DetailPost from "~/pages/admin/PostManagement/DetailPost/DetailPost";
import DeletePost from "~/pages/admin/PostManagement/DeletePost/DeletePost";
import PostList from "~/pages/admin/PostManagement/PostList/PostList";
import EditOrder from "~/pages/admin/OrderManagement/EditOrder/EditOrder";
import ManufactureManagement from "~/pages/admin/ManufactureManagement/ManufactureManagement";
import AddOrder from "~/pages/admin/OrderManagement/AddOrder/AddOrder";
import ViewDetail from "~/layout/client/Product/ViewDetail";
import ProtectedRoute from "~/layout/client/ProtectedRoute";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        { path: "", element: <Home /> }
        
      ],
    },
    {
      path: "/admin",
      element:  
        <ProtectedRoute>
          <LayoutDefault />
        </ProtectedRoute>,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "users", element: <Users /> },
        { path: "orders", element: <Order /> },
        { path: "orders/add", element: <AddOrder /> },
        { path: "products", element: <Products /> },
        { path: "products/create", element: <CreateProduct /> },
        { path: "categories", element: <Categories /> },
        { path: "orders/edit/:id", element: <EditOrder /> },
        { path: "categories/create", element: <CreateCategory /> },
        { path: "categories/edit/:id", element: <EditCategory /> },
        { path: "categories/detail/:id", element: <DetailCategory /> },
        { path: "users", element: <Users /> },
        { path: "users/create", element: <CreateUser /> },
        { path: "users/edit/:id", element: <EditUser /> },
        { path: "users/detail/:id", element: <DetailUser /> },
        { path: "chat", element: <ChatPage /> },
        { path: "manufactures", element: <ManufactureManagement /> },
        { path: "manufactures/create", element: <CreateManufacture /> },
        { path: "manufactures/:id", element: <DetailManufacture /> },
        { path: "manufactures/edit/:id", element: <EditManufacture /> },
        { path: "manufactures/delete/:id", element: <DeleteManufacture /> },
        { path: "manufactures/detail/:id", element: <DetailManufacture /> },
        { path: "posts", element: <PostList /> },
        { path: "posts/create", element: <CreatePostForm /> },
        { path: "posts/:id", element: <DetailPost /> },
        { path: "posts/edit/:id", element: <EditPost /> },
        { path: "posts/delete/:id", element: <DeletePost /> },
      ],
    },
  ]);
  return routes;
}
