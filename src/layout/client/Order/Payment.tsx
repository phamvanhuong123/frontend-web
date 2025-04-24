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
  Button,
  Modal,
  Card,
  List,
} from "antd";
import {
  DeleteTwoTone,
  LoadingOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
} from "../../../redux/order/orderSlice";
import { orderApi } from "~/services/axios.order";
import { getImageUrl } from "~/config/config";
import { addressApi } from "~/services/axios.address";
import "./Payment.css";
import { paymentApi } from "~/services/axios.payment";
import moment from "moment";
const { TextArea } = Input;

interface PaymentProps {
  setCurrentStep: (step: number) => void;
}

interface ShippingAddress {
  id?: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  streetAddress: string;
  ward?: string;
  district?: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

const formatAddress = (address: ShippingAddress): string => {
  const parts = [
    address.streetAddress,
    address.ward,
    address.district,
    address.city,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
};

const Payment: React.FC<PaymentProps> = ({ setCurrentStep }) => {
  const carts = useSelector((state: any) => state.order.carts);
  const user = useSelector((state: any) => state.account.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    []
  );
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<
    string | undefined
  >();

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

  // Fetch user's shipping addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;

      try {
        const response = await addressApi.getByUserId(user.id);
        if (response) {
          const addresses: ShippingAddress[] = response.map((addr: any) => ({
            id: addr.id || addr.Id,
            userId: addr.userId || addr.UserId,
            receiverName: addr.receiverName || addr.ReceiverName,
            receiverPhone: addr.receiverPhone || addr.ReceiverPhone,
            streetAddress: addr.streetAddress || addr.StreetAddress,
            ward: addr.ward || addr.Ward,
            district: addr.district || addr.District,
            city: addr.city || addr.City,
            country: addr.country || addr.Country || "Vietnam",
            postalCode: addr.postalCode || addr.PostalCode,
            isDefaultShipping: addr.isDefaultShipping || addr.IsDefaultShipping,
            isDefaultBilling: addr.isDefaultBilling || addr.IsDefaultBilling,
          }));

          setShippingAddresses(addresses);

          // Find default shipping address or first address
          const defaultAddress = addresses.find(
            (addr) => addr.isDefaultShipping
          );
          setSelectedAddress(defaultAddress || addresses[0] || null);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        notification.error({
          message: "Lỗi lấy địa chỉ",
          description: "Không thể lấy danh sách địa chỉ, vui lòng thử lại sau",
        });
      }
    };

    fetchAddresses();
  }, [user?.id]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();
        if (data) setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleCityChange = async (cityCode: string) => {
    setSelectedCity(cityCode);
    setSelectedDistrict(undefined);
    setWards([]);
    addressForm.setFieldsValue({ district: undefined, ward: undefined });

    try {
      const data = await addressApi.getDistrictsByProvince(cityCode);
      if (data) setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrict(districtCode);
    addressForm.setFieldsValue({ ward: undefined });

    try {
      const data = await addressApi.getWardsByDistrict(districtCode);
      if (data) setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const showAddressModal = () => {
    setIsAddressModalVisible(true);
  };

  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
    setIsAddingNewAddress(false);
    addressForm.resetFields();
  };

  const handleNewAddressClick = () => {
    setIsAddingNewAddress(true);
    setIsAddressModalVisible(true);
    addressForm.resetFields();
    addressForm.setFieldsValue({
      receiverName: user?.fullName || "",
      receiverPhone: user?.phone || "",
      country: "Vietnam",
    });
  };

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setIsAddressModalVisible(false);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await addressApi.setDefaultAddress(addressId);

      const updatedAddresses = shippingAddresses.map((addr) => ({
        ...addr,
        isDefaultShipping: addr.id === addressId,
      }));

      setShippingAddresses(updatedAddresses);

      if (selectedAddress?.id === addressId) {
        setSelectedAddress({ ...selectedAddress, isDefaultShipping: true });
      }

      message.success("Đã thiết lập địa chỉ mặc định");
    } catch (error) {
      console.error("Error setting default address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thiết lập địa chỉ mặc định",
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await addressApi.delete(addressId);

      const updatedAddresses = shippingAddresses.filter(
        (addr) => addr.id !== addressId
      );

      setShippingAddresses(updatedAddresses);

      if (selectedAddress?.id === addressId) {
        const defaultAddress = updatedAddresses.find(
          (addr) => addr.isDefaultShipping
        );
        setSelectedAddress(defaultAddress || updatedAddresses[0] || null);
      }

      message.success("Đã xóa địa chỉ");
    } catch (error) {
      console.error("Error deleting address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa địa chỉ",
      });
    }
  };

  const handleAddAddress = async () => {
    try {
      const values = await addressForm.validateFields();

      const cityName = provinces.find((c) => c.code === values.city)?.name;
      const districtName = districts.find(
        (d) => d.code === values.district
      )?.name;
      const wardName = wards.find((w) => w.code === values.ward)?.name;

      const newAddress: ShippingAddress = {
        userId: user?.id,
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        streetAddress: values.streetAddress,
        city: cityName || values.city,
        district: districtName || values.district,
        ward: wardName || values.ward,
        country: values.country || "Vietnam",
        postalCode: values.postalCode,
        isDefaultShipping:
          values.isDefaultShipping || shippingAddresses.length === 0,
        isDefaultBilling: values.isDefaultBilling || false,
      };

      const response = await addressApi.create(newAddress);
      if (response) {
        const savedAddress = response;
        const updatedAddresses = [...shippingAddresses, savedAddress];

        setShippingAddresses(updatedAddresses);
        setSelectedAddress(savedAddress);
        setIsAddingNewAddress(false);
        setIsAddressModalVisible(false);
        addressForm.resetFields();

        message.success("Đã thêm địa chỉ mới");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm địa chỉ mới",
      });
    }
  };

  const onFinish = async () => {
    if (!selectedAddress || !selectedAddress.id) {
      notification.error({
        message: "Thiếu thông tin",
        description: "Vui lòng chọn địa chỉ giao hàng",
      });
      return;
    }

    setIsSubmit(true);
    const orderItems = carts.map((item: any) => ({
      productId: item.detail.id,
      productName: item.detail.mainText,
      quantity: item.quantity,
      price: item.detail.price,
    }));

    const orderCode = `ORDER-${Date.now()}`;

    const orderData = {
      orderCode: orderCode,
      userId: user?.id,
      shippingAddressId: selectedAddress.id,
      billingAddressId: selectedAddress.isDefaultBilling
        ? selectedAddress.id
        : undefined,
      totalAmount: totalPrice,
      notes: form.getFieldValue("notes"),
      orderItems: orderItems,
      status: "PENDING", // Enum value for pending
      paymentMethod: paymentMethod,
    };

    try {
      if (paymentMethod === "vnpay") {
        // Handle VNPay payment logic here
        // For example, redirect to VNPay payment page
        // get url
        const paymentData = {
          orderCode: orderCode,
          // id:
          fullName: user?.fullName,
          description: "Thanh toán đơn hàng",
          amount: totalPrice,
          createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
        };

        const vnPayUrl = await paymentApi.createVnPayPayment(paymentData);
        console.log("vnPayUrl", vnPayUrl);
        if (vnPayUrl?.url) {
          window.location.href = vnPayUrl.url;
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tạo đơn hàng VNPay",
          });
        }
      }
      const res = await orderApi.createOrder(orderData);
      if (res?.data) {
        message.success("Đặt hàng thành công!");
        dispatch(doPlaceOrderAction({ orderItems, totalAmount: totalPrice }));
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.message || "Không thể đặt hàng",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
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
        {/* Shipping Address Card */}
        <Card className="address-card" title="Địa chỉ giao hàng">
          {selectedAddress ? (
            <div className="selected-address">
              <div className="address-header">
                <span className="name">
                  <strong>{selectedAddress.receiverName} | </strong>
                </span>
                <span className="phone">
                  <strong>{selectedAddress.receiverPhone}</strong>
                </span>
                <div className="address">
                  {/* {selectedAddress.isDefaultShipping && (
                    <p className="default-tag">Mặc định</p>
                  )} */}
                  <span className="address-home">Nhà</span>
                  {formatAddress(selectedAddress)}
                </div>
              </div>
              {/* <div className="address-content">
                
              </div> */}
              <Button type="link" onClick={showAddressModal}>
                Thay đổi
              </Button>
            </div>
          ) : (
            <div className="no-address">
              <p>Bạn chưa có địa chỉ giao hàng</p>
              <Button type="primary" onClick={handleNewAddressClick}>
                Thêm địa chỉ giao hàng
              </Button>
            </div>
          )}
        </Card>

        <Form form={form} layout="vertical">
          <Form.Item name="notes" label="Ghi chú đơn hàng">
            <TextArea
              rows={3}
              placeholder="Thêm ghi chú cho đơn hàng nếu cần"
            />
          </Form.Item>
        </Form>

        {/* Product List */}
        {carts?.map((product: any, index: number) => {
          const currentProductPrice = product?.detail?.price ?? 0;
          return (
            <div
              className="order-product"
              key={`product-${product.id || index}`}
            >
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
          <button onClick={onFinish} disabled={isSubmit || !selectedAddress}>
            {isSubmit && (
              <span>
                <LoadingOutlined /> &nbsp;
              </span>
            )}
            Đặt Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>

      {/* Address Selection Modal */}
      <Modal
        title={
          isAddingNewAddress ? "Thêm địa chỉ mới" : "Chọn địa chỉ giao hàng"
        }
        open={isAddressModalVisible}
        onCancel={handleAddressModalCancel}
        footer={null}
        width={700}
      >
        {!isAddingNewAddress ? (
          <>
            <List
              dataSource={shippingAddresses}
              renderItem={(address) => (
                <List.Item
                  key={address.id}
                  actions={[
                    <Button
                      type="link"
                      onClick={() => handleSelectAddress(address)}
                      disabled={selectedAddress?.id === address.id}
                    >
                      {selectedAddress?.id === address.id ? "Đã chọn" : "Chọn"}
                    </Button>,
                    !address.isDefaultShipping && (
                      <Button
                        type="link"
                        onClick={() => handleSetDefaultAddress(address.id!)}
                      >
                        Đặt làm mặc định
                      </Button>
                    ),
                    <Button
                      danger
                      type="link"
                      onClick={() => handleDeleteAddress(address.id!)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      address.isDefaultShipping ? (
                        <CheckCircleFilled
                          style={{ color: "#52c41a", fontSize: "20px" }}
                        />
                      ) : null
                    }
                    title={
                      <div>
                        <span className="receiver-name">
                          {address.receiverName}
                        </span>
                        <span className="receiver-phone">
                          {" "}
                          | {address.receiverPhone}
                        </span>
                        {address.isDefaultShipping && (
                          <span className="default-tag"> [Mặc định]</span>
                        )}
                      </div>
                    }
                    description={formatAddress(address)}
                  />
                </List.Item>
              )}
            />
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNewAddressClick}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          </>
        ) : (
          <Form form={addressForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
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
                  <Input placeholder="Nhập tên người nhận" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
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
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh/thành phố!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={handleCityChange}
                    options={provinces.map((city) => ({
                      value: city.code,
                      label: city.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    disabled={!selectedCity}
                    options={districts.map((district) => ({
                      value: district.code,
                      label: district.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã!" },
                  ]}
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
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ chi tiết"
              name="streetAddress"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ chi tiết không được để trống!",
                },
              ]}
            >
              <Input placeholder="Số nhà, tên đường, khu vực" />
            </Form.Item>

            <Form.Item label="Mã bưu điện (tùy chọn)" name="postalCode">
              <Input placeholder="Nhập mã bưu điện nếu có" />
            </Form.Item>

            <Form.Item label="Quốc gia" name="country" initialValue="Vietnam">
              <Input disabled />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="isDefaultShipping" valuePropName="checked">
                  <Radio.Group>
                    <Radio value={true}>
                      Đặt làm địa chỉ giao hàng mặc định
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isDefaultBilling" valuePropName="checked">
                  <Radio.Group>
                    <Radio value={true}>
                      Đặt làm địa chỉ thanh toán mặc định
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: "right" }}>
              <Button
                onClick={handleAddressModalCancel}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button type="primary" onClick={handleAddAddress}>
                Thêm địa chỉ
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </Row>
  );
};

const setCurrentStep = (step: number) => {
  console.log(`Navigating to step: ${step}`);
};

export default Payment;
