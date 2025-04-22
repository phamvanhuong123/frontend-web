import  Button  from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "~/redux/account/accountSlice";
import LogoutIcon from '@mui/icons-material/Logout';
import { SidebarFooterProps } from "@toolpad/core/DashboardLayout";
function LogoutButton({ mini }: SidebarFooterProps) {
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

          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.04)'
          }
        }}
      >
        {mini ? "" : "Đăng xuất"}
      </Button>
      
    );
  }
export default LogoutButton