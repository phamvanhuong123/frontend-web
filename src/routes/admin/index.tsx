import { useRoutes } from "react-router-dom";
import LayoutDefault from "~/layout/admin/LayoutDefault/LayoutDefault";
import Categories from "~/pages/admin/CategoryManagement/CategoryManagement";
import Dashboard from "~/pages/admin/Dashboard/Dashboard";
import Order from "~/pages/admin/OrderManagement/OrderManagement";
import Products from "~/pages/admin/ProductManagement/ProductManagement";
import Users from "~/pages/admin/UserManagement/UserManagement";



function RouterAdmin(){
    const element = useRoutes([
        {
            path  : '/admin',
            element : <LayoutDefault/>,
            children : [
                {
                    path : '',
                    element : <Dashboard/>,
                },
                {
                    path : 'users',
                    element : <Users/>
                },
                {
                    path : 'orders',
                    element : <Order/>
                },
                {
                    path : 'products',
                    element : <Products/>
                },
                {
                    path : 'categories',
                    element : <Categories/>
                }
            ]
        }
    ]);
    return element;
}
export default RouterAdmin