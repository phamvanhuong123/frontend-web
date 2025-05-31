import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { couponApi } from "~/services/axios.coupon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const discountTypes = [
  { value: "PERCENTAGE", label: "PHẦN TRĂM" },
  { value: "FIXED_AMOUNT", label: "CỐ ĐỊNH" },
];

function CreateCoupon() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<any>({
    code: "SALE2026",
    description: "Giảm giá mừng lễ 30/4 - 1/5",
    discountType: "PERCENTAGE", // Sử dụng chuỗi
    value: 20.0,
    minimumSpend: 100.0,
    startTime: "2025-05-01T00:00:00Z",
    endTime: "2025-05-10T23:59:59Z",
    usageLimit: 100,
    usageLimitPerUser: 1,
    isActive: true,
    userId: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoupon({
      ...coupon,
      [name]: value,
    });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setCoupon({
      ...coupon,
      [name as string]: value,
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCoupon({
      ...coupon,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !coupon.code ||
      !coupon.discountType ||
      !coupon.value ||
      !coupon.minimumSpend
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    try {
      // Chuyển đổi discountType về số trước khi gửi lên server nếu backend yêu cầu
      const updatedCoupon = {
        ...coupon,
        discountType: coupon.discountType === "PERCENTAGE" ? 0 : 1, // Chuyển chuỗi sang số
        startTime: coupon.startTime
          ? new Date(coupon.startTime).toISOString().slice(0, 19) + "Z"
          : undefined,
        endTime: coupon.endTime
          ? new Date(coupon.endTime).toISOString().slice(0, 19) + "Z"
          : undefined,
      };
      await couponApi.create(updatedCoupon);
      toast.success("Tạo coupon thành công", {
        autoClose: 1000,
        transition: Flip,
      });
      navigate("/admin/coupons");
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Tạo coupon thất bại", {
        autoClose: 1000,
        transition: Flip,
      });
    }
  };

  return (
    <Card
      sx={{
        width: 600,
        maxWidth: "100%",
        margin: "auto",
        mt: 4,
        p: 2,
        overflow: "auto",
      }}
    >
      <CardContent sx={{ overflowY: "auto", flex: 1, pb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tạo Coupon Mới
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
              label="Mã Giảm Giá*"
              name="code"
              value={coupon.code}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={coupon.description}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Loại Giảm Giá*"
              name="discountType"
              value={coupon.discountType}
              onChange={handleSelectChange}
              required
              margin="normal"
            >
              {discountTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Giá Trị Giảm Giá*"
              name="value"
              type="number"
              value={coupon.value}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Đơn Hàng Tối Thiểu*"
              name="minimumSpend"
              type="number"
              value={coupon.minimumSpend}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giới hạn sử dụng"
              name="usageLimit"
              type="number"
              value={coupon.usageLimit}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giới hạn sử dụng mỗi người"
              name="usageLimitPerUser"
              type="number"
              value={coupon.usageLimitPerUser}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ngày Bắt Đầu"
              name="startTime"
              type="datetime-local"
              value={coupon.startTime}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Ngày Kết Thúc"
              name="endTime"
              type="datetime-local"
              value={coupon.endTime}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={coupon.isActive}
                  onChange={handleSwitchChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Kích hoạt Coupon"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Tạo Coupon
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateCoupon;
