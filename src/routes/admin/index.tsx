import AdminLayoutDefault from "~/layout/admin/LayoutDefault/LayoutDefault";
import Dashboard from "~/pages/admin/Dashboard/Dashboard";
import Users from "~/pages/admin/UserManagement/UserManagement";
import CreateUser from "~/pages/admin/UserManagement/CreateUser/CreateUser";
import EditUser from "~/pages/admin/UserManagement/EditUser/EditUser";
import DetailUser from "~/pages/admin/UserManagement/DetailUser/DetailUser";
import Order from "~/pages/admin/OrderManagement/OrderManagement";
import AddOrder from "~/pages/admin/OrderManagement/AddOrder/AddOrder";
import EditOrder from "~/pages/admin/OrderManagement/EditOrder/EditOrder";
import Products from "~/pages/admin/ProductManagement/ProductManagement";
import CreateProduct from "~/pages/admin/ProductManagement/CreateProduct/CreateProduct";
import Categories from "~/pages/admin/CategoryManagement/CategoryManagement";
import CreateCategory from "~/pages/admin/CategoryManagement/CreateCategory/CreateCategory";
import EditCategory from "~/pages/admin/CategoryManagement/EditCategory/EditCategory";
import DetailCategory from "~/pages/admin/CategoryManagement/DetailCategory/DetailCategory";
import ChatPage from "~/pages/admin/ChatManagement/ChatPage";
import ManufactureManagement from "~/pages/admin/ManufactureManagement/ManufactureManagement";
import CreateManufacture from "~/pages/admin/ManufactureManagement/CreateManufacture/CreateManufacture";
import EditManufacture from "~/pages/admin/ManufactureManagement/EditManufacture/EditManufacture";
import DetailManufacture from "~/pages/admin/ManufactureManagement/DetailManufacture/DetailManufacture";
import DeleteManufacture from "~/pages/admin/ManufactureManagement/DeleteManufacture/DeleteManufacture";
import PostList from "~/pages/admin/PostManagement/PostList/PostList";
import CreatePostForm from "~/pages/admin/PostManagement/CreatePost/CreatePost";
import EditPost from "~/pages/admin/PostManagement/EditPost/EditPost";
import DetailPost from "~/pages/admin/PostManagement/DetailPost/DetailPost";
import DeletePost from "~/pages/admin/PostManagement/DeletePost/DeletePost";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayoutDefault />,
  children: [
    { path: "", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "users/create", element: <CreateUser /> },
    { path: "users/edit/:id", element: <EditUser /> },
    { path: "users/detail/:id", element: <DetailUser /> },
    { path: "orders", element: <Order /> },
    { path: "orders/add", element: <AddOrder /> },
    { path: "orders/edit/:id", element: <EditOrder /> },
    { path: "products", element: <Products /> },
    { path: "products/create", element: <CreateProduct /> },
    { path: "categories", element: <Categories /> },
    { path: "categories/create", element: <CreateCategory /> },
    { path: "categories/edit/:id", element: <EditCategory /> },
    { path: "categories/detail/:id", element: <DetailCategory /> },
    { path: "chat", element: <ChatPage /> },
    { path: "manufactures", element: <ManufactureManagement /> },
    { path: "manufactures/create", element: <CreateManufacture /> },
    { path: "manufactures/edit/:id", element: <EditManufacture /> },
    { path: "manufactures/delete/:id", element: <DeleteManufacture /> },
    { path: "manufactures/detail/:id", element: <DetailManufacture /> },
    { path: "posts", element: <PostList /> },
    { path: "posts/create", element: <CreatePostForm /> },
    { path: "posts/edit/:id", element: <EditPost /> },
    { path: "posts/delete/:id", element: <DeletePost /> },
    { path: "posts/:id", element: <DetailPost /> },
  ],
};

export default adminRoutes;
