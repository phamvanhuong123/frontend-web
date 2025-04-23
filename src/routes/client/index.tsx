import LayoutClient from "~/layout/client/LayoutDefault/LayoutDefault";
import Home from "../../layout/client/Home";
import ProductPage from "~/pages/client/product";
import OrderPage from "~/pages/client/order";
import History from "~/layout/client/Order/History";
import PaymentResponse from "~/layout/client/Order/PaymentResponse";
import Cart from "~/layout/client/cart/cart";

const clientRoutes = {
  path: "/",
  element: <LayoutClient />,
  children: [
    { path: "", element: <Home /> },
    { path: "products", element: <ProductPage /> },
    { path: "orders", element: <OrderPage /> },
    { path: "history", element: <History /> },
    { path: "orders/payment/response", element: <PaymentResponse /> },
    { path: "cart", element: <Cart /> },
  ],
};

export default clientRoutes;
