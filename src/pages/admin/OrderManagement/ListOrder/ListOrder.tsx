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

function ListOrder() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [Orders, setOrders] = useState<Order[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const orderData = await orderApi.getAll();
      setOrders(orderData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount * 1000);
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
            {Orders.map((order) => (
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
                    <Typography fontWeight={500}>{order.orderCode}</Typography>
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
                    <Chip
                      label={
                        order.paymentId ? "Đã thanh toán" : "Chưa thanh toán"
                      }
                      color={order.paymentId ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={order.notes}>
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
                  {/* <TableCell align="center">
                    {getStatusChip(category.status)}
                  </TableCell> */}
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
                                sx={{ fontWeight: 600 }}
                                align="center"
                              >
                                Số lượng
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }} align="right">
                                Đơn giá
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }} align="right">
                                Thành tiền
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.orderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  Product ID: {item.productId}
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
            ))}
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
