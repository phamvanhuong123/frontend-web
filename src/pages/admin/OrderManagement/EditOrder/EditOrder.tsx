import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Chip,
  Divider,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  Avatar,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  LocalShipping,
  Cancel,
  Loop,
  PendingActions,
  Undo,
  DoneAll,
  Print,
  HelpOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "~/services/axios.order";
import Order from "~/types/order";
import { JSX } from "@emotion/react/jsx-runtime";
import { paymentApi } from "~/services/axios.payment";

const statusMap: Record<
  string,
  { label: string; color: any; icon: JSX.Element }
> = {
  PENDING: { label: "Chờ xử lý", color: "warning", icon: <PendingActions /> },
  PROCESSING: { label: "Đang xử lý", color: "info", icon: <Loop /> },
  SHIPPED: { label: "Đã giao", color: "secondary", icon: <LocalShipping /> },
  DELIVERED: { label: "Đã nhận", color: "success", icon: <DoneAll /> },
  CANCELED: { label: "Đã hủy", color: "error", icon: <Cancel /> },
  RETURNED: { label: "Đã trả", color: "default", icon: <Undo /> },
};

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [statusPayment, setStatusPayment] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderApi.getOrderById(id!);
        setOrder(orderData);
      } catch (error) {
        toast.error("Không tải được đơn hàng");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;

    const fetchPaymentStatus = async () => {
      try {
        const paymentData = await paymentApi.getPaymentByOrderId(id);
        setStatusPayment(paymentData.status);
      } catch (error) {
        toast.error("Không tải được thông tin thanh toán");
      }
    };

    fetchPaymentStatus();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!order) return;
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderApi.updateOrderStatus(order.id, newStatus);
      toast.success(`Cập nhật trạng thái: ${newStatus}`);
      setOrder(await orderApi.getOrderById(id!));
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setUpdating(true);
    try {
      await orderApi.updateOrder(order.id, order);
      toast.success("Đã lưu thay đổi!");
      navigate("/admin/orders");
    } catch (error) {
      toast.error("Không thể lưu!");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    toast.info("Đang mở giao diện in...");
    window.print();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box py={6}>
        <Typography>Không tìm thấy đơn hàng</Typography>
      </Box>
    );
  }
  const currentStatus = statusMap[order.status] || {
    label: "Không xác định",
    color: "default",
    icon: <HelpOutline />,
  };

  const renderPaymentStatus = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Chưa thanh toán" color="warning" />;
      case 1:
        return <Chip label="Đã thanh toán" color="success" />;
      case 2:
        return <Chip label="Đã hoàn tiền" color="error" />;
      default:
        return <Chip label="Không xác định" color="default" />;
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/orders")}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>

        <Typography variant="h5" gutterBottom fontWeight={600}>
          Chỉnh sửa đơn hàng: {order.orderCode}
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Mã đơn hàng"
                value={order.orderCode}
                disabled
              />
              <TextField
                fullWidth
                select
                label="Trạng thái đơn hàng"
                name="status"
                value={order.status}
                onChange={handleChange}
              >
                {Object.entries(statusMap).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                name="notes"
                value={order.notes || ""}
                onChange={handleChange}
              />
              <Box>
                <Typography fontWeight={600}>Thanh toán</Typography>
                {renderPaymentStatus(statusPayment)}
              </Box>
              <Box>
                <Typography fontWeight={600}>Trạng thái hiện tại</Typography>
                <Chip
                  icon={currentStatus.icon}
                  label={currentStatus.label}
                  color={currentStatus.color}
                />
              </Box>

              <Divider />

              <Typography variant="h6">Sản phẩm đã đặt</Typography>

              {order.orderItems.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={item.productImage || "/placeholder.png"}
                      alt={item.productName}
                      variant="rounded"
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography fontWeight={600}>
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {item.productId}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box flex={1}>
                    <Box display="flex" fontWeight={600} mb={0.5}>
                      <Box flex={1}>Số lượng</Box>
                      <Box flex={1}>Đơn giá</Box>
                      <Box flex={1}>Tổng</Box>
                    </Box>
                    <Box display="flex">
                      <Box flex={1}>{item.quantity}</Box>
                      <Box flex={1}>{formatCurrency(item.priceAtOrder)}</Box>
                      <Box flex={1}>{formatCurrency(item.totalItemPrice)}</Box>
                    </Box>
                  </Box>
                </Paper>
              ))}

              <Box textAlign="right" mt={2}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "success.main",
                    fontWeight: 600,
                    backgroundColor: "rgba(0, 128, 0, 0.05)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  Tổng tiền: {formatCurrency(order.totalAmount)}
                </Typography>
              </Box>

              <Divider />

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent="space-between"
              >
                <Box>
                  {order.status === "PENDING" && (
                    <Button
                      variant="contained"
                      onClick={() => handleStatusChange("PROCESSING")}
                      disabled={updating}
                    >
                      Xác nhận đơn
                    </Button>
                  )}
                  {order.status === "PROCESSING" && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Print />}
                        onClick={handlePrintInvoice}
                        sx={{ mr: 2 }}
                      >
                        In vận đơn
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<LocalShipping />}
                        onClick={() => handleStatusChange("SHIPPED")}
                        disabled={updating}
                      >
                        Giao hàng
                      </Button>
                    </>
                  )}
                  {order.status === "SHIPPED" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange("DELIVERED")}
                      disabled={updating}
                    >
                      Đã giao hàng
                    </Button>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : "Lưu thay đổi"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditOrder;
