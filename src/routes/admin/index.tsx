import { useRoutes } from "react-router-dom";
import Login from "../../pages/admin/Login/Login";


function RouterAdmin(){
    const element = useRoutes([
        {
            path  : '/admin',
            element : <Login/>
        }
    ]);
    return element;
}
export default RouterAdmin