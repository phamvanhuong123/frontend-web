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
import { couponApi } from "~/services/axios.coupon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Coupon from "~/types/coupon";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BlockIcon from "@mui/icons-material/Block";
import DiscountIcon from "@mui/icons-material/Discount";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";

function DetailCoupon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const couponData = (await couponApi.getById(id!)).data;
        // Chuyển đổi discountType từ số sang chuỗi nếu cần
        const mappedCoupon = {
          ...couponData,
          discountType:
            couponData.discountType === 0 ? "PERCENTAGE" : "FIXED_AMOUNT",
        };
        setCoupon(mappedCoupon);
      } catch (error) {
        console.error("Error fetching coupon:", error);
        navigate("/admin/coupons", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id, navigate]);

  if (loading) {
    return <Typography>Đang tải thông tin coupon...</Typography>;
  }

  if (!coupon) {
    return <Typography>Không tìm thấy coupon</Typography>;
  }

  const formatDiscountType = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}%` : `${value}k`;
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Thông tin chi tiết Coupon
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DiscountIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Mã Coupon:</strong> {coupon.code}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DiscountIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Mô tả:</strong>{" "}
                  {coupon.description || "Chưa có mô tả"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Giá Trị:</strong>{" "}
                  {formatDiscountType(coupon.discountType, coupon.value)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Ngày Bắt Đầu:</strong>{" "}
                  {coupon.startTime
                    ? new Date(coupon.startTime).toLocaleString("vi-VN")
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DiscountIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Loại Giảm Giá:</strong>{" "}
                  {coupon.discountType === "PERCENTAGE"
                    ? "Phần trăm"
                    : "Cố định"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Đơn Hàng Tối Thiểu:</strong> {coupon.minimumSpend}k
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Giới hạn sử dụng:</strong>{" "}
                  {coupon.usageLimit || "Không giới hạn"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Giới hạn mỗi người:</strong>{" "}
                  {coupon.usageLimitPerUser || "Không giới hạn"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Ngày Kết Thúc:</strong>{" "}
                  {coupon.endTime
                    ? new Date(coupon.endTime).toLocaleString("vi-VN")
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              <strong>Trạng Thái:</strong>
            </Typography>
            {coupon.isActive ? (
              <Chip
                icon={<VerifiedUserIcon />}
                label="Đang hoạt động"
                color="success"
              />
            ) : (
              <Chip icon={<BlockIcon />} label="Đã tắt" color="error" />
            )}
          </Box>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/coupons")}
          >
            Danh sách Coupon
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DetailCoupon;
