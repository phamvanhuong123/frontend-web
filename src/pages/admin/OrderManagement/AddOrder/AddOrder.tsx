import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ORDER_STATUSES } from "../OrderManagement";
import Product from "~/types/product";
import Order from "~/types/order";
import { productApi } from "~/services/axios.product";
import { orderApi } from "~/services/axios.order";
import Address from "~/types/address";
import { addressApi } from "~/services/axios.address";

function AddOrder() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Order>({
    id: uuidv4(),
    orderCode: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: "",
    shippingAddressId: "",
    billingAddressId: null,
    couponId: null,
    paymentId: null,
    notes: "",
    totalAmount: 0,
    orderItems: [],
    status: "PENDING",
  });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRes = await productApi.getAll();
        setProducts(productRes);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!formData.userId) {
        setAddresses([]);
        return;
      }
      try {
        const addressRes = await addressApi.getByUserId(formData.userId);
        setAddresses(addressRes);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, [formData.userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleAddItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingIndex = formData.orderItems.findIndex(
      (item) => item.productId === selectedProductId
    );

    let updatedItems;
    if (existingIndex !== -1) {
      updatedItems = [...formData.orderItems];
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].totalItemPrice =
        updatedItems[existingIndex].quantity * product.price;
    } else {
      const newItem = {
        id: uuidv4(),
        productId: product.id,
        quantity,
        priceAtOrder: product.price,
        totalItemPrice: product.price * quantity,
      };
      updatedItems = [...formData.orderItems, newItem];
    }

    const total = updatedItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    setFormData((prev) => ({
      ...prev,
      orderItems: updatedItems,
      totalAmount: total,
    }));

    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.orderItems.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => {
      const p = products.find((p) => p.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    setFormData((prev) => ({
      ...prev,
      orderItems: updatedItems,
      totalAmount: total,
    }));
  };

  const handleSubmit = async () => {
    console.log("Đơn hàng mới:", formData);
    // Gửi đơn hàng đến API hoặc thực hiện hành động khác ở đây
    await orderApi.createOrder(formData);
    navigate("/admin/orders");
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "0 auto",
        bgcolor: "#fff",
        borderRadius: 4,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Thêm đơn hàng
      </Typography>

      <TextField
        label="Mã đơn hàng"
        name="orderCode"
        value={formData.orderCode}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="ID người dùng"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <Select
          value={formData.shippingAddressId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              shippingAddressId: e.target.value,
            }))
          }
          displayEmpty
        >
          <MenuItem value="" disabled>
            Chọn địa chỉ giao hàng
          </MenuItem>
          {addresses.map((addr) => (
            <MenuItem key={addr.id} value={addr.id}>
              {`${addr.streetAddress}, ${addr.ward ?? ""}, ${addr.district ?? ""}, ${addr.city}, ${addr.country}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.shippingAddressId && (
        <Box sx={{ mt: 1, ml: 1 }}>
          <Typography variant="body2">
            Người nhận:{" "}
            {
              addresses.find((a) => a.id === formData.shippingAddressId)
                ?.receiverName
            }{" "}
            -{" "}
            {
              addresses.find((a) => a.id === formData.shippingAddressId)
                ?.receiverPhone
            }
          </Typography>
        </Box>
      )}

      <TextField
        label="Ghi chú"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />

      <TextField
        label="Tổng tiền"
        name="totalAmount"
        type="number"
        value={formData.totalAmount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <Select value={formData.status} onChange={handleSelectChange}>
          {Object.entries(ORDER_STATUSES).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Chọn sản phẩm */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Thêm sản phẩm</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mt: 2,
          }}
        >
          <FormControl fullWidth>
            <Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Chọn sản phẩm
              </MenuItem>
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} - {p.price.toLocaleString()}đ
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ width: isMobile ? "100%" : 120 }}
          />

          <Button
            variant="outlined"
            onClick={handleAddItem}
            disabled={!selectedProductId || quantity <= 0}
          >
            Thêm
          </Button>
        </Box>
      </Box>

      {/* Danh sách sản phẩm */}
      {formData.orderItems.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sản phẩm đã chọn
          </Typography>
          {formData.orderItems.map((item, index) => {
            const product = products.find((p) => p.id === item.productId);
            return (
              <Card
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <CardMedia
                  component="img"
                  image={product?.imagePath || "/placeholder.png"}
                  alt={product?.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{product?.name}</Typography>
                  <Typography color="text.secondary">
                    Số lượng: {item.quantity} | Giá:{" "}
                    {(product?.price ?? 0).toLocaleString()} đ
                  </Typography>
                  <Typography>
                    Thành tiền: {item.totalItemPrice.toLocaleString()} đ
                  </Typography>
                </CardContent>
                <Button
                  color="error"
                  onClick={() => handleRemoveItem(index)}
                  sx={{ alignSelf: "center", m: 1 }}
                >
                  Xóa
                </Button>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Nút hành động */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/orders")}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu đơn
        </Button>
      </Box>
    </Box>
  );
}

export default AddOrder;
