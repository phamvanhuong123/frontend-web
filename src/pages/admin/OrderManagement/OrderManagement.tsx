import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ListOrder from "./ListOrder/ListOrder";
import { useState } from "react";
import {
  PendingActions,
  Loop,
  LocalShipping,
  DoneAll,
  Cancel,
  Undo,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const ORDER_STATUSES = {
  PENDING: {
    label: "Chờ xử lý",
    color: "warning",
    icon: <PendingActions fontSize="small" />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "info",
    icon: <Loop fontSize="small" />,
  },
  SHIPPED: {
    label: "Đã giao",
    color: "secondary",
    icon: <LocalShipping fontSize="small" />,
  },
  DELIVERED: {
    label: "Đã nhận",
    color: "success",
    icon: <DoneAll fontSize="small" />,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "error",
    icon: <Cancel fontSize="small" />,
  },
  RETURNED: {
    label: "Đã trả",
    color: "default",
    icon: <Undo fontSize="small" />,
  },
};

function OrderManagement() {
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const navigate = useNavigate();

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handlePaymentChange = (event: SelectChangeEvent) => {
    setPaymentStatus(event.target.value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ bgcolor: "#FFFFFF", p: 3, borderRadius: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            id="search"
            label="Tìm kiếm"
            type="search"
            variant="outlined"
            sx={{
              width: 200,
              "& input": { px: 0 },
              "&:hover label": { color: "rgb(105, 177, 255)" },
              ".MuiOutlinedInput-root": {
                px: 1,
                "&:hover fieldset": { borderColor: "rgb(105, 177, 255)" },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(105, 177, 255)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ fontSize: 18, marginRight: 1 }} />
              ),
            }}
          />

          {/* Bộ lọc */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Trạng thái đơn hàng */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select value={status} onChange={handleStatusChange}>
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value.icon} {value.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Trạng thái thanh toán */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select value={paymentStatus} onChange={handlePaymentChange}>
                <MenuItem value="all">Tất cả thanh toán</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
              </Select>
            </FormControl>

            {/* Nút chức năng */}
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => navigate("add")}
            >
              Thêm đơn
            </Button>
            <Button variant="outlined">Tải lại</Button>
          </Box>
        </Box>

        {/* Danh sách đơn hàng */}
        <ListOrder statusFilter={status} paymentStatusFilter={paymentStatus} />
      </Box>
    </Box>
  );
}

export default OrderManagement;
