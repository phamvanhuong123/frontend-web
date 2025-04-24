import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Descriptions, Table, Tag, Spin, message } from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { orderApi } from "~/services/axios.order";
import Order from "~/types/order";
import { JSX } from "@emotion/react/jsx-runtime";

const OrderDetails = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (!orderCode) {
          throw new Error("Order code is undefined");
        }
        const response = await orderApi.getOrderByOrderCode(orderCode);
        setOrder(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Không thể tải thông tin đơn hàng");
        message.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderCode]);

  const getOrderStatusTag = (status: string): JSX.Element => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Đang xử lý
          </Tag>
        );
      case "CONFIRMED":
        return <Tag color="blue">Đã xác nhận</Tag>;
      case "SHIPPING":
        return <Tag color="orange">Đang giao hàng</Tag>;
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoàn thành
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Đã hủy
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Chờ thanh toán
          </Tag>
        );
      case "PAID":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã thanh toán
          </Tag>
        );
      case "FAILED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Thanh toán thất bại
          </Tag>
        );
      case "REFUNDED":
        return <Tag color="purple">Đã hoàn tiền</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: { productCode: string }) => (
        <div>
          <div>{text}</div>
          <div style={{ color: "#888" }}>SKU: {record.productCode}</div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: any, record: { price: number; quantity: number }) =>
        `${(record.price * record.quantity).toLocaleString()} VND`,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>{error}</p>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Không tìm thấy đơn hàng</p>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "16px" }}
      >
        Quay lại
      </Button>

      <h1>Chi tiết đơn hàng: {order.orderCode}</h1>

      <Descriptions bordered column={2} style={{ marginBottom: "24px" }}>
        <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
          {getOrderStatusTag(order.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {new Date(order.createdAt).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          <strong>{order.totalAmount.toLocaleString()} VND</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {order.notes || "Không có ghi chú"}
        </Descriptions.Item>
      </Descriptions>

      {order.payment && (
        <div style={{ marginBottom: "24px" }}>
          <h2>Thông tin thanh toán</h2>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Phương thức">
              {order.payment.paymentMethod === "VNPAY"
                ? "VNPay"
                : "Tiền mặt (COD)"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getPaymentStatusTag(order.payment.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Mã giao dịch">
              {order.payment.transactionId || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian thanh toán">
              {order.payment.paidAt
                ? new Date(order.payment.paidAt).toLocaleString()
                : "Chưa thanh toán"}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              {order.payment.amount.toLocaleString()} VND
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}

      <h2>Danh sách sản phẩm</h2>
      <Table
        columns={columns}
        dataSource={order.orderItems}
        rowKey="id"
        pagination={false}
      />

      <div style={{ marginTop: "24px", textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => navigate("/orders")}
          style={{ marginRight: "8px" }}
        >
          Danh sách đơn hàng
        </Button>
        {order.status === "PENDING" && (
          <Button
            type="default"
            danger
            onClick={() => {
              // Xử lý hủy đơn hàng
              message.warning("Tính năng hủy đơn hàng đang phát triển");
            }}
          >
            Hủy đơn hàng
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
