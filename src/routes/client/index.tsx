import { useRoutes } from "react-router-dom";
import Home from "~/pages/client/Home/Home";
import LayoutDefault from "~/layout/client/LayoutDefault/LayoutDefault";


function RouterClient(){
    const element = useRoutes([
        {
            path  : '/',
            element : <LayoutDefault/>,
            children : [
                {
                    path : '',
                    element : <Home/>
                }
            ]
        }
    ]);
    return element;
}
export default RouterClient