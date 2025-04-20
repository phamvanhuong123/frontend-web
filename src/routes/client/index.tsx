import LayoutClient from "~/layout/client/LayoutDefault/LayoutDefault";
import Home from "../../layout/client/Home";
import ProductPage from "~/pages/client/product";
import OrderPage from "~/pages/client/order";

const clientRoutes = {
  path: "/",
  element: <LayoutClient />,
  children: [
    { path: "", element: <Home /> },
    { path: "product/:slug", element: <ProductPage /> },
    { path: "orders", element: <OrderPage /> },
  ],
};

export default clientRoutes;
