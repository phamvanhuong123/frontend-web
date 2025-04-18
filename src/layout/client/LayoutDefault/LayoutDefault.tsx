import { Outlet } from "react-router-dom"
import Footer from "../Footer"
import Header from "../Header/"

function LayoutDefault(){
    return <>
        <Header searchTerm="" setSearchTerm={() => {}}/>
        <Outlet/>
        <Footer/>
    </>
}
export default LayoutDefault