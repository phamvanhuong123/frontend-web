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
import { couponApi } from "~/services/axios.coupon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Coupon from "~/types/coupon";

const discountTypes = [
  { value: "PERCENTAGE", label: "PERCENTAGE" },
  { value: "FIXED_AMOUNT", label: "FIXED_AMOUNT" },
];

function EditCoupon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<Coupon>({
    id: "",
    code: "",
    description: "",
    discountType: "PERCENTAGE", // Khởi tạo là chuỗi
    value: 0,
    minimumSpend: 0,
    startTime: "",
    endTime: "",
    usageLimit: 0,
    usageLimitPerUser: 0,
    isActive: true,
    userId: null,
  });
  const [loading, setLoading] = useState(true);

  // Hàm định dạng ngày để khớp với input datetime-local
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Cắt bỏ giây và múi giờ
  };

  // Hàm ánh xạ discountType từ số sang chuỗi
  const mapDiscountTypeFromApi = (
    discountType: number | string
  ): "PERCENTAGE" | "FIXED_AMOUNT" => {
    if (typeof discountType === "number") {
      return discountType === 0 ? "PERCENTAGE" : "FIXED_AMOUNT";
    }
    return discountType === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const couponRes = (await couponApi.getById(id)).data;
          // Ánh xạ discountType từ số sang chuỗi trước khi gán vào state
          const mappedCoupon = {
            ...couponRes,
            discountType: mapDiscountTypeFromApi(couponRes.discountType),
            startTime: formatDateForInput(couponRes.startTime),
            endTime: formatDateForInput(couponRes.endTime),
          };
          setCoupon(mappedCoupon);
        }
      } catch (error) {
        console.error("Error fetching coupon data:", error);
        toast.error("Không thể tải dữ liệu coupon", {
          autoClose: 1000,
          transition: Flip,
        });
        navigate("/admin/coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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

    // Kiểm tra các trường bắt buộc
    if (
      !coupon.code ||
      !coupon.discountType ||
      coupon.value === undefined ||
      coupon.value <= 0 ||
      coupon.minimumSpend === undefined ||
      coupon.minimumSpend <= 0
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
          ? new Date(coupon.startTime).toISOString()
          : undefined,
        endTime: coupon.endTime
          ? new Date(coupon.endTime).toISOString()
          : undefined,
      };
      await couponApi.update(coupon.id, updatedCoupon);
      toast.success("Cập nhật coupon thành công", {
        autoClose: 1000,
        transition: Flip,
      });
      navigate("/admin/coupons");
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Cập nhật coupon thất bại", {
        autoClose: 1000,
        transition: Flip,
      });
    }
  };

  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

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
          Chỉnh sửa Coupon
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
              value={coupon.description || ""}
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
              value={coupon.usageLimit || ""}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giới hạn sử dụng mỗi người"
              name="usageLimitPerUser"
              type="number"
              value={coupon.usageLimitPerUser || ""}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ngày Bắt Đầu"
              name="startTime"
              type="datetime-local"
              value={coupon.startTime || ""}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Ngày Kết Thúc"
              name="endTime"
              type="datetime-local"
              value={coupon.endTime || ""}
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
              Cập nhật Coupon
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditCoupon;
