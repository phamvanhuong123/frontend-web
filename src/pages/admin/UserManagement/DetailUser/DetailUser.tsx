import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import { userApi } from "~/services/axios.user";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BlockIcon from "@mui/icons-material/Block";
import User from "~/types/user";
function DetailUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userApi.getById(id!);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/admin/users", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return <Typography>Đang tải thông tin người dùng...</Typography>;
  }

  if (!user) {
    return <Typography>Không tìm thấy người dùng</Typography>;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      default:
        return "Người dùng";
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2,
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        marginBottom : 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Thông tin chi tiết người dùng
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          {/* Thay thế Grid bằng Box với flexbox */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            mb: 2 
          }}>
            {/* Cột thông tin bên trái */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Họ và tên:</strong> {user.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Box>
            </Box>

            {/* Cột thông tin bên phải */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <VerifiedUserIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1" sx={{ mr: 1 }}>
                  <strong>Vai trò:</strong> {getRoleLabel(user.role)}
                </Typography>
                <Chip
                  label={user.role}
                  color={
                    user.role === "ADMIN"
                      ? "error"
                      : user.role === "STAFF"
                      ? "warning"
                      : "success"
                  }
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              <strong>Trạng thái:</strong>
            </Typography>
            {user.isActive ? (
              <Chip
                icon={<VerifiedUserIcon />}
                label="Đang hoạt động"
                color="success"
              />
            ) : (
              <Chip
                icon={<BlockIcon />}
                label="Đã khóa"
                color="error"
              />
            )}
          </Box>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/users")}
          >
            Danh sách người dùng
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DetailUser;