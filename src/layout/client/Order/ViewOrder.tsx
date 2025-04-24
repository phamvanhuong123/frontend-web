import { Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doUpdateCartAction,
  doSetSelectedProductsAction
} from "../../../redux/order/orderSlice";
import { getImageUrl } from "~/config/config";

interface ViewOrderProps {
  setCurrentStep: (step: number) => void;
}

const ViewOrder = ({ setCurrentStep }: ViewOrderProps) => {
  const carts = useSelector((state: any) => state.order.carts);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

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

  const handleOnChangeInput = (value: number | null, product: any) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({
          quantity: value,
          detail: product,
          id: product.id,
        })
      );
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={18} xs={24}>
        {carts?.map((product: any, index: number) => {
          const currentProductPrice = product?.detail?.price ?? 0;
          return (
            <div className="order-product" key={`index-${index}`}>
              <div className="product-content">
                <img
                  src={getImageUrl(product?.detail?.images?.[0]?.url)}
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
                <div className="quantity">
                  <InputNumber
                    min={1}
                    onChange={(value) => handleOnChangeInput(value, product)}
                    value={product.quantity}
                  />
                </div>
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
        {carts.length === 0 && (
          <div className="order-product-empty">
            <Empty description="Không có sản phẩm trong giỏ hàng" />
          </div>
        )}
      </Col>
      <Col md={6} xs={24}>
        <div className="order-sum">
          <div className="calculate">
            <span>Tạm tính</span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <div className="calculate">
            <span>Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <button
            disabled={carts.length === 0}
            onClick={() => {
              dispatch(doSetSelectedProductsAction(carts)); // Lưu vào Redux
              setCurrentStep(1); // Tiếp tục tới bước thanh toán
            }}
          >
            Mua Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default ViewOrder;
