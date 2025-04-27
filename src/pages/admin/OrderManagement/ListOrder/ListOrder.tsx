import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderApi } from "~/services/axios.order";
import Order from "~/types/order";
import Product from "~/types/product";
import { productApi } from "~/services/axios.product";
import { paymentApi } from "~/services/axios.payment";

type ListOrderProps = {
  statusFilter: string; // "all", "PENDING", "SHIPPED", etc.
  paymentStatusFilter: string; // "all", "paid", "unpaid"
};

function ListOrder({ statusFilter, paymentStatusFilter }: ListOrderProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [Orders, setOrders] = useState<Order[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, number>
  >({});
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const orderData = await orderApi.getAll();
      const productData = await productApi.getAll();
      setProducts(productData);
      setOrders(orderData);

      // Fetch payment statuses for all orders
      const statusPromises = orderData.map(async (order) => {
        try {
          const status = (await paymentApi.getPaymentByOrderId(order.id))
            .status;
          return { orderId: order.id, status };
        } catch (error) {
          console.error(
            `Failed to fetch payment status for order ${order.id}:`,
            error
          );
          return { orderId: order.id, status: 0 }; // Default to "not paid" on error
        }
      });

      const statusResults = await Promise.all(statusPromises);
      const statusMap = statusResults.reduce(
        (acc, { orderId, status }) => {
          acc[orderId] = status;
          return acc;
        },
        {} as Record<string, number>
      );

      setPaymentStatuses(statusMap);
      console.log(statusMap);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getProductName = (id: any) => {
    const product = products.find((p) => p.id === id);
    return product ? product.name : `ID: ${id}`;
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEdit = (id: string) => {
    navigate(`edit/${id}`);
  };

  const handleShipOrder = async (id: string) => {
    try {
      await orderApi.updateOrderStatus(id, "PROCESSING");
      toast.success("Đã cập nhật trạng thái giao hàng!");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi khi xử lý vận chuyển!");
    }
  };

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      await orderApi.deleteOrder(orderToDelete);
      toast.success("Xóa đơn hàng thành công!");
      fetchOrders();
    } catch (error) {
      toast.error("Xóa đơn hàng thất bại!");
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  // Render payment status chip based on status code
  const renderPaymentStatus = (statusCode: number) => {
    switch (statusCode) {
      case 0:
        return <Chip label="Chưa thanh toán" color="warning" />;
      case 1:
        return <Chip label="Đã thanh toán" color="success" />;
      case 2:
        return <Chip label="Đã hủy" color="error" />;
      case 3:
        return <Chip label="Đã hoàn tiền" color="error" />;
      default:
        return <Chip label="Không xác định" color="default" />;
    }
  };

  // 👉 Lọc danh sách đơn hàng theo filter
  const filteredOrders = Orders.filter((order) => {
    const matchStatus = statusFilter === "all" || order.status === statusFilter;

    const matchPayment =
      paymentStatusFilter === "all" ||
      (paymentStatusFilter === "paid" && paymentStatuses[order.id]) ||
      (paymentStatusFilter === "unpaid" && !paymentStatuses[order.id]);

    return matchStatus && matchPayment;
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50px" }} />
              <TableCell sx={{ fontWeight: 600 }}>Mã đơn hàng</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Số sản phẩm
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Tổng tiền
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Thanh toán
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Ghi chú
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {expandedOrderId === order.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {order.orderCode}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.orderItems.length}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {renderPaymentStatus(paymentStatuses[order.id] || 0)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={order.notes || ""}>
                        <Typography
                          sx={{
                            maxWidth: "150px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.notes || "-"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton onClick={() => toggleExpand(order.id)}>
                            <VisibilityOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(order.id)}
                          >
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xử lý vận chuyển">
                          <IconButton
                            color="secondary"
                            onClick={() => handleShipOrder(order.id)}
                          >
                            <LocalShippingOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(order.id)}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={7}>
                      <Collapse
                        in={expandedOrderId === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Chi tiết đơn hàng
                          </Typography>
                          <Table size="small" aria-label="order items">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Sản phẩm
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Số lượng
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Đơn giá
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Thành tiền
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.orderItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    {getProductName(item.productId)}
                                  </TableCell>
                                  <TableCell align="center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(item.priceAtOrder)}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography fontWeight={500}>
                                      {formatCurrency(item.totalItemPrice)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} align="right">
                                  <Typography variant="subtitle1">
                                    Tổng cộng:
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {formatCurrency(order.totalAmount)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="subtitle1">
                    Không có đơn hàng nào phù hợp với tiêu chí lọc
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đơn hàng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListOrder;
