import { useRoutes } from "react-router-dom";
import Home from "~/pages/client/Home/Home";
import LayoutDefault from "~/layout/client/LayoutDefault/LayoutDefault";
import ProductPage from "~/pages/client/product";
import OrderPage from "~/pages/client/order";

function RouterClient() {
  const element = useRoutes([
    {
      path: "/",
      element: <LayoutDefault />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "product/:id",
          element: <ProductPage />,
        },
        {
          path: "orders",
          element: <OrderPage />,
        },
      ],
    },
  ]);
  return element;
}
export default RouterClient;
