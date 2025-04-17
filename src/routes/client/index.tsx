import { useRoutes } from "react-router-dom";
import Home from "~/pages/client/Home/Home";
import LayoutDefault from "~/layout/client/LayoutDefault/LayoutDefault";
import CheckOut from '~/pages/client/Home/CheckOut';


function RouterClient() {
    const element = useRoutes([
        {
            path: '/',
            element: <LayoutDefault />,
            children: [
                {
                    path: '',
                    element: <Home />
                },
                {
                    path: 'checkout',
                    element: <CheckOut />
                }
            ]
        }
    ]);
    return element;
}
export default RouterClient