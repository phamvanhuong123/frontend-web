import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { userApi } from "~/services/axios.user";
import { toast } from "react-toastify";
import { Flip } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const roles = [
  { value: '2', label: 'Người dùng' },
  { value: '1', label: 'Nhân viên' },
  { value: '0', label: 'Quản trị viên' },
];

function CreateUser() {
  const navigate = useNavigate();
  const [CreateAUser, setCreateAUser] = useState({
    name: "",
    password: "",
    email: "",
    phoneNumber: "",
    role: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateAUser({
      ...CreateAUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!CreateAUser.name || !CreateAUser.email || !CreateAUser.password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(CreateAUser.email)) {
      toast.warning("Email không hợp lệ", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    try {
      await userApi.createUser(CreateAUser);
      toast.success("Tạo người dùng thành công", {
        autoClose: 1000,
        transition: Flip,
      });
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Tạo người dùng thất bại", {
        autoClose: 1000,
        transition: Flip,
      });
    }
  };

  return (
    <Card sx={{ width : 600, maxWidth: '100%', margin: "auto", mt: 4, p: 2, overflow : 'auto' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography marginBottom={3} variant="h4" component="h1">
            Tạo người dùng mới
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Họ và tên*"
              name="name"
              value={CreateAUser.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email*"
              name="email"
              type="email"
              value={CreateAUser.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="password*"
              name="password"
              type="password"
              value={CreateAUser.password}
              onChange={handleChange}   
              required
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={CreateAUser.phoneNumber}
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              label="Vai trò"
              name="role"
              value={CreateAUser.role}
              onChange={handleChange}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Divider />

            {/* <FormControlLabel
              control={
                <Switch
                  checked={user.isActive}
                  onChange={handleSwitchChange}
                  name="isActive"
                  color="primary"
                />
              }
              label={`Trạng thái: ${user.isActive ? "Đang hoạt động" : "Đã khóa"}`}
            /> */}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/admin/users")}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Tạo người dùng
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateUser;