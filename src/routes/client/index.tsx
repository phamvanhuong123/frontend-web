import LayoutClient from "~/layout/client/LayoutDefault/LayoutDefault";
import Home from "../../layout/client/Home";
import ProductPage from "~/pages/client/product";
import OrderPage from "~/pages/client/order";
import History from "~/layout/client/Order/History";
import PaymentResponse from "~/layout/client/Order/PaymentResponse";
import Cart from "~/layout/client/cart/cart";
import OrderDetails from "~/layout/client/Order/OrderDetails";
import Vouchers from "~/layout/client/Voucher";
import Guide from "~/layout/client/Guide";
import Contact from "~/layout/client/Contact";
import PrivacyPolicy from "~/layout/client/PrivacyPolicy";
import ReturnPolicy from "~/layout/client/ReturnPolicy";
const clientRoutes = {
  path: "/",
  element: <LayoutClient />,
  children: [
    { path: "", element: <Home /> },
    { path: "products", element: <ProductPage /> },
    { path: "orders", element: <OrderPage /> },
    { path: "orders/:orderCode", element: <OrderDetails /> },
    { path: "history", element: <History /> },
    { path: "orders/payment/response", element: <PaymentResponse /> },
    { path: "cart", element: <Cart /> },
    { path: "vouchers", element: <Vouchers /> },
    { path: "guide", element: <Guide /> },
    { path: "return-policy", element: <ReturnPolicy /> },
    { path: "privacy-policy", element: <PrivacyPolicy /> },
    { path: "contact", element: <Contact /> },
  ],
};

export default clientRoutes;
