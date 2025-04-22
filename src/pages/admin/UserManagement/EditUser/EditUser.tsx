import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Flip, toast } from "react-toastify";
import { userApi } from "~/services/axios.user"; // Assuming you have a user API service
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import User from "~/types/user"; 

const roles = [
    { value: 'CUSTOMER', label: 'Người dùng' },
    { value: 'STAFF', label: 'Nhân viên' },
    { value: 'ADMIN', label: 'Quản trị viên' },
  ];

function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: "",
    id: "",
    isActive: true,
    name: "",
    role: "USER",
    phoneNumber: "",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const userRes = await userApi.getById(id);
          setUser(userRes);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Không thể tải dữ liệu người dùng", {
          autoClose: 1000,
          transition: Flip,
        });
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUser({
      ...user,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user.name || !user.email) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    try {
      if (id) {
        await userApi.updateUser(user.id, user);
        toast.success("Cập nhật người dùng thành công", {
          autoClose: 1000,
          transition: Flip,
        });
      } else {
        await userApi.createUser(user);
        toast.success("Tạo người dùng thành công", {
          autoClose: 1000,
          transition: Flip,
        });
      }
      
      navigate("/admin/users");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(id ? "Cập nhật người dùng thất bại" : "Tạo người dùng thất bại", {
        autoClose: 1000,
        transition: Flip,
      });
    }
  };

  if (loading && id) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Card sx={{ 
        width : 600, maxWidth: '100%', margin: "auto", mt: 4, p: 2, overflow : 'auto' 
      }}>
        <CardContent sx={{
          overflowY: 'auto',
          flex: 1,
          pb: 4 
        }}>
        <Typography variant="h5" gutterBottom>
          {id ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
        </Typography>
        <Button 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
        >
            Quay lại
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <TextField
              fullWidth
              label="Họ và tên*"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email*"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              margin="normal"
              disabled={!!id} // Disable email field when editing
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Vai trò"
              name="role"
              value={user.role}
              onChange={handleChange}
              margin="normal"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <FormControlLabel
              control={
                <Switch
                  checked={user.isActive}
                  onChange={handleSwitchChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Kích hoạt tài khoản"
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              {id ? "Cập nhật người dùng" : "Tạo người dùng"}
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditUser;