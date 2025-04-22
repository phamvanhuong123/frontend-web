import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatIcon from '@mui/icons-material/Chat';
import FactoryIcon from '@mui/icons-material/Factory';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LogoutIcon from '@mui/icons-material/Logout';

import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { doLogoutAction } from "../../../redux/account/accountSlice";

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
  {
    segment: "admin/chat",
    title: "Chat",
    icon: <ChatIcon />,
  },
  {
    segment: "admin/manufactures",
    title: "Manufactures",
    icon: <FactoryIcon />,
  },
  {
    segment: "admin/posts",
    title: "Post",
    icon: <PostAddIcon />,
  },
];

function CustomAppTitle() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 600
    }}>
      Admin
    </Box>
  );
}

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(doLogoutAction());
    localStorage.removeItem('access_token');
    navigate('/login');
  };
  
  return (
    <Button
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{
        color: 'error.main',
        mb: 2,
        '&:hover': {
          backgroundColor: 'rgba(211, 47, 47, 0.04)'
        }
      }}
    >
      Đăng xuất
    </Button>
  );
}

function AdminLayoutDefault() {
  return (
    <>
      <ReactRouterAppProvider navigation={NAVIGATION}>
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            sidebarFooter: LogoutButton, 
          }}
          sx={{
            bgcolor: '#FAFAFB',
          }}
        >
          <Outlet />
        </DashboardLayout>
      </ReactRouterAppProvider>
    </>
  );
}

export default AdminLayoutDefault;
