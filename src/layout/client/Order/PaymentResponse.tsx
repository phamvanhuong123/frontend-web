// src/pages/Payment/PaymentResponse.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Descriptions, Spin } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./PaymentResponse.css";
import VnPayResponse from "~/types/payment";
import { paymentApi } from "~/services/axios.payment";

const PaymentResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [response, setResponse] = useState<VnPayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Kiểm tra các tham số bắt buộc từ VNPay
    if (!queryParams.has("vnp_ResponseCode")) {
      setError("Thiếu tham số phản hồi từ VNPay");
      setLoading(false);
      return;
    }

    // Gửi request đến backend để xác thực
    const verifyPayment = async () => {
      try {
        const res = await paymentApi.ProcessPaymentResponse(
          Object.fromEntries(queryParams)
        );
        setResponse({
          success: res.success,
          paymentMethod: queryParams.get("vnp_CardType") || "",
          orderDescription: queryParams.get("vnp_OrderInfo") || "",
          orderCode: queryParams.get("vnp_TxnRef") || "",
          paymentId: queryParams.get("vnp_TransactionNo") || "",
          transactionId: queryParams.get("vnp_TransactionNo") || "",
          vnPayResponseCode: queryParams.get("vnp_ResponseCode") || "",
        });
      } catch (err) {
        setError("Xác thực thanh toán thất bại");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (loading) {
    return <Spin tip="Đang xử lý kết quả thanh toán..." size="large" />;
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate("/")}>
            <HomeOutlined /> Về trang chủ
          </Button>
        }
      />
    );
  }

  return (
    <div className="payment-response-container">
      <Card
        title={
          response?.success ? "Thanh toán thành công" : "Thanh toán thất bại"
        }
        style={{ maxWidth: 800, margin: "20px auto" }}
        headStyle={{
          backgroundColor: response?.success ? "#52c41a" : "#f5222d",
          color: "white",
        }}
      >
        {response?.success ? (
          <Alert
            message="Cảm ơn bạn đã thanh toán!"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message={`Thanh toán không thành công (Mã lỗi: ${response?.vnPayResponseCode})`}
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        <Descriptions bordered column={1} style={{ marginTop: 20 }}>
          <Descriptions.Item label="Mã đơn hàng">
            {response?.orderCode}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {response?.paymentMethod || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {response?.orderDescription}
          </Descriptions.Item>

          {response?.success && (
            <>
              <Descriptions.Item label="Mã giao dịch VNPay">
                {response?.transactionId}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {new Date().toLocaleString()}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          {response?.success ? (
            <Button
              type="primary"
              onClick={() => navigate(`/orders/${response.orderCode}`)}
            >
              Xem đơn hàng
            </Button>
          ) : (
            <Button type="dashed" danger onClick={() => navigate("/cart")}>
              Thử lại thanh toán
            </Button>
          )}

          <Button style={{ marginLeft: 8 }} onClick={() => navigate("/")}>
            <HomeOutlined /> Trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentResponse;
