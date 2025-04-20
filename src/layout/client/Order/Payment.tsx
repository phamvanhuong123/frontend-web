import {
  Col,
  Divider,
  Form,
  Radio,
  Row,
  message,
  notification,
  Input,
} from "antd";
import { DeleteTwoTone, LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
} from "../../../redux/order/orderSlice";
import { orderApi } from "~/services/axios.order";
import { getImageUrl } from "~/config/config";

const { TextArea } = Input;

interface PaymentProps {
  setCurrentStep: (step: number) => void;
}

const Payment: React.FC<PaymentProps> = ({ setCurrentStep }) => {
  const carts = useSelector((state: any) => state.order.carts);
  const user = useSelector((state: any) => state.account.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (carts && carts.length > 0) {
      const sum = carts.reduce(
        (acc: number, item: any) => acc + item.quantity * item.detail.price,
        0
      );
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const onFinish = async (values: {
    name: string;
    phone: string;
    address: string;
  }) => {
    setIsSubmit(true);
    const detailOrder = carts.map((item: any) => ({
      productName: item.detail.mainText,
      quantity: item.quantity,
      id: item.id,
    }));

    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice,
      detail: detailOrder,
    };

    try {
      const res = await orderApi.callPlaceOrder(data);
      if (res && res.data) {
        message.success("Đặt hàng thành công!");
        dispatch(doPlaceOrderAction({ detailOrder, totalPrice }));
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.message || "Không thể đặt hàng",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {carts?.map((product: any, index: number) => {
          const currentProductPrice = product?.detail?.price ?? 0;
          return (
            <div className="order-product" key={`index-${index}`}>
              <div className="product-content">
                <img
                  src={getImageUrl(product?.detail?.thumbnail)}
                  alt="product Thumbnail"
                />
                <div className="title">{product?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProductPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">Số lượng: {product?.quantity}</div>
                <div className="sum">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProductPrice * (product?.quantity ?? 0))}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(doDeleteItemCartAction({ id: product.id }))
                  }
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
      </Col>
      <Col md={8} xs={24}>
        <div className="order-sum">
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Tên người nhận"
              name="name"
              initialValue={user?.fullName}
              rules={[
                {
                  required: true,
                  message: "Tên người nhận không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Số điện thoại"
              name="phone"
              initialValue={user?.phone}
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Địa chỉ không được để trống!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
          <div className="info">
            <div className="method">
              <div>Hình thức thanh toán</div>
              <Radio checked>Thanh toán khi nhận hàng</Radio>
            </div>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <div className="calculate">
            <span>Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <button onClick={() => form.submit()} disabled={isSubmit}>
            {isSubmit && (
              <span>
                <LoadingOutlined /> &nbsp;
              </span>
            )}
            Đặt Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Payment;
