import { useRoutes } from "react-router-dom";
import Home from "~/pages/client/Home/Home";
import LayoutDefault from "~/layout/client/LayoutDefault/LayoutDefault";
import ProductDetail from '../../pages/client/Home/ProductDetail';


function RouterClient() {
    const element = useRoutes([
        {
            path: '/',
            element: <LayoutDefault />,
            children: [
              {
                path: '',
                element: <Home />,
              },
              {
                path: 'product/:id',
                element: <ProductDetail />,
              },
            ],
          },
        ]);
    return element;
}
export default RouterClient;