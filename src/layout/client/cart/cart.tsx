import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  Empty,
  InputNumber,
  message,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";

const { Title, Text } = Typography;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    try {
      const storedCarts = localStorage.getItem("cart");
      if (storedCarts) {
        const parsed: unknown = JSON.parse(storedCarts);
        if (Array.isArray(parsed)) {
          setCartItems(parsed as CartItem[]);
        } else {
          console.error("Dữ liệu trong localStorage không hợp lệ");
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Lỗi khi đọc localStorage:", error);
      setCartItems([]);
    }
  }, []);

  const handleRemove = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleQuantityChange = (id: number, newQuantity: number | null) => {
    if (!newQuantity || newQuantity < 1) return;

    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleRemoveSelected = () => {
    const updated = cartItems.filter(
      (item) => !selectedRowKeys.includes(item.id)
    );
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    setSelectedRowKeys([]);
    message.success("Đã xóa các sản phẩm đã chọn");
  };

  const handleSelectAll = () => {
    setSelectedRowKeys(cartItems.map((item) => item.id));
  };

  const handleBuy = () => {
    const selectedItems = cartItems.filter((item) =>
      selectedRowKeys.includes(item.id)
    );
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Thanh toán chưa làm
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={qty}
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, record: CartItem) =>
        `${(record.price * record.quantity).toLocaleString()}₫`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record: CartItem) => (
        <Button danger onClick={() => handleRemove(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const rowSelection: TableRowSelection<CartItem> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container" style={{ padding: "20px" }}>
      <Title level={2}>Giỏ hàng</Title>
      {cartItems.length > 0 ? (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            bordered
          />
          <div
            style={{
              textAlign: "right",
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <Space wrap>
              <Button onClick={handleSelectAll}>Chọn tất cả</Button>
              <Button
                danger
                disabled={selectedRowKeys.length === 0}
                onClick={handleRemoveSelected}
              >
                Xóa đã chọn
              </Button>
            </Space>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Text strong style={{ fontSize: 16 }}>
                Tổng cộng: {totalPrice.toLocaleString()}₫
              </Text>
              <Button
                type="primary"
                disabled={selectedRowKeys.length === 0}
                onClick={handleBuy}
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Empty description="Không có sản phẩm trong giỏ hàng" />
      )}
    </div>
  );
};

export default Cart;
