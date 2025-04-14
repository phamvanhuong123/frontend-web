import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {  type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import  Box  from "@mui/material/Box";


const NAVIGATION: Navigation = [
  {
    segment: "admin",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin/users",
    title: "Users",
    icon: <PersonOutlineIcon />
  },
  {
    segment: "admin/products",
    title: "Products",
    icon: <ProductionQuantityLimitsIcon />
  },
  {
    segment: "admin/categories",
    title: "Categories",
    icon: <CategoryIcon />
  },
  {
    segment: "admin/orders",
    title: "Orders",
    icon: <AddShoppingCartIcon />,
  },
];

function CustomAppTitle() {
    return (
      <Box sx={{
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        fontSize : 20,
        fontWeight : 600
      }}>
        Admin
      </Box>
    );
}


function LayoutDefault() {
  return (
    <>
      <ReactRouterAppProvider navigation={NAVIGATION}>
        <DashboardLayout  
        slots={{
            appTitle : CustomAppTitle,
           
        }}
        sx={{
          bgcolor : '#FAFAFB',
         
        }}
        >
          <Outlet  />
        </DashboardLayout>
      </ReactRouterAppProvider>
    </>
  );
}
export default LayoutDefault;
