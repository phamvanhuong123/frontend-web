import {
  Col,
  Divider,
  Form,
  Radio,
  Row,
  message,
  notification,
  Input,
  Select,
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
import { District, Province, Ward } from "~/types/address";
import { addressApi } from "~/services/axios.address";

const { TextArea } = Input;

interface PaymentProps {
  setCurrentStep: (step: number) => void;
}

const Payment = ({ setCurrentStep : PaymentProps } : PaymentProps) => {
  const carts = useSelector((state: any) => state.order.carts);
  const user = useSelector((state: any) => state.account.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();

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

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
  
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    form.setFieldsValue({ district: undefined, ward: undefined }); // Reset trường quận/huyện và xã
  
    try {
      const data = await addressApi.getDistrictsByProvince(provinceCode);
      setDistricts(data);
      setWards([]); // Reset danh sách xã/phường
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrict(districtCode);
    form.setFieldsValue({ ward: undefined }); // Reset trường xã
  
    try {
      const data = await addressApi.getWardsByDistrict(districtCode);
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const onFinish = async (values: {
    name: string;
    phone: string;
    receiverName: string;
    receiverPhone: string;
    address: string;
    street: string;
    city: string;
    district: string;
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
      paymentMethod,
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
              name="receiverName"
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
              label="Số điện thoại người nhận"
              name="receiverPhone"
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
              label="Tỉnh/Thành phố"
              name="province"
              rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
                options={provinces.map((province) => ({
                  value: province.code,
                  label: province.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                options={districts.map((district) => ({
                  value: district.code,
                  label: district.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={!selectedDistrict}
                options={wards.map((ward) => ({
                  value: ward.code,
                  label: ward.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Đường/Phố"
              name="street"
              rules={[
                { required: true, message: "Đường/Phố không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Địa chỉ chi tiết"
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
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)} 
              value={paymentMethod} 
            >
              <Radio value="cod">Thanh toán khi nhận hàng</Radio>
              <Radio value="vnpay">Thanh toán qua VNPay</Radio>
            </Radio.Group>
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

const setCurrentStep = (step: number) => {
  console.log(`Navigating to step: ${step}`);
};

export default Payment;
