import { Row, Col, Rate, Divider, Breadcrumb } from "antd";
import "./ViewDetail.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import ProductLoader from "./ProductLoader";
import { useDispatch } from "react-redux";
import {
  doAddProductAction,
  doSetSelectedProductsAction,
} from "../../../redux/order/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../config/config";

interface ViewDetailProps {
  dataProduct: {
    id: string;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    categoryName: string;
    manufacturerName: string;
    discountName: string | null;
    slug: string;
    quantity: number | null;
    sold: number | null;
    images: {
      id: string;
      productId: string;
      url: string;
      altText: string;
      displayOrder: number;
    }[];
  };
}

const ViewDetail = ({ dataProduct }: ViewDetailProps) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const refGallery = useRef<any>(null);
  const images =
    dataProduct?.images?.map((image) => {
      console.log("image.url", image.url);
      return {
        original: getImageUrl(image.url),
        thumbnail: getImageUrl(image.url), // Có thể sử dụng hình nhỏ khác nếu có
        alt: image.altText,
      };
    }) ?? [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    navigate(`/product/${dataProduct.id}`);
  };

  const handleChangeButton = (type: "MINUS" | "PLUS") => {
    if (type === "MINUS") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity - 1);
    }
    if (type === "PLUS") {
      if (
        dataProduct.quantity !== null &&
        currentQuantity >= dataProduct.quantity
      )
        return;
      setCurrentQuantity(currentQuantity + 1);
    }
  };

  const handleChangeInput = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (
      !isNaN(parsedValue) &&
      parsedValue > 0 &&
      (dataProduct.quantity === null || parsedValue <= dataProduct.quantity)
    ) {
      setCurrentQuantity(parsedValue);
    }
  };

  const handleAddToCart = (quantity: number, product: any) => {
    // Tạo object sản phẩm cần thêm vào giỏ hàng
    const productDetail = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images || [],
    };

    dispatch(
      doAddProductAction({ quantity, detail: productDetail, id: product.id })
    );

    // // Lấy giỏ hàng hiện tại từ localStorage
    // const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // // Kiểm tra nếu sản phẩm đã tồn tại
    // const index = existingCart.findIndex((item: any) => item.id === Product.id);

    // if (index !== -1) {
    //   // Nếu sản phẩm đã tồn tại, tăng số lượng
    //   existingCart[index].quantity += quantity;
    // } else {
    //   // Nếu chưa có, thêm sản phẩm mới
    //   existingCart.push(newItem);
    // }

    // // Lưu lại giỏ hàng mới vào localStorage
    // localStorage.setItem("cart", JSON.stringify(existingCart));

    // // Phát sự kiện storage để đồng bộ với các thành phần khác
    // window.dispatchEvent(new Event("storage"));

    // // Dùng Redux để sync UI (nếu cần)
    // dispatch(doAddProductAction({ quantity, detail: Product, id: Product.id }));

    // // Hiển thị thông báo thành công
    // message.success("Sản phẩm đã được thêm vào Giỏ hàng");
  };

  const handleBuyNow = (quantity: number, product: any) => {
    const productDetail = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images || [],
    };

    dispatch(
      doAddProductAction({ quantity, detail: productDetail, id: product.id })
    );
    dispatch(
      doSetSelectedProductsAction({
        products: [
          {
            id: product.id,
            quantity,
            detail: productDetail,
          },
        ],
      })
    );
    navigate("/orders");
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-Product"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <Breadcrumb
          style={{ margin: "5px 0" }}
          items={[
            {
              title: <HomeOutlined />,
            },
            {
              title: (
                <Link to="/">
                  <span>Trang Chủ</span>
                </Link>
              ),
            },
          ]}
        />
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {dataProduct && dataProduct.id ? (
            <Row gutter={[20, 20]}>
              <Col md={10} sm={0} xs={0}>
                <ImageGallery
                  ref={refGallery}
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                  slideOnThumbnailOver={true}
                  onClick={handleOnClickImage}
                />
              </Col>
              <Col md={14} sm={24}>
                <Col md={0} sm={24} xs={24}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    renderLeftNav={() => <></>}
                    renderRightNav={() => <></>}
                    showThumbnails={false}
                  />
                </Col>
                <Col span={24}>
                  <div className="manufacturerName">
                    Nhà cung cấp:{" "}
                    <a href="#">{dataProduct?.manufacturerName}</a>
                  </div>
                  <div className="title">{dataProduct?.name}</div>
                  <div className="rating">
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 12 }}
                    />
                    <span className="sold">
                      <Divider type="vertical" />
                      Đã bán {dataProduct.sold}
                    </span>
                  </div>
                  <div className="price">
                    <span className="currency">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(dataProduct?.price ?? 0)}
                    </span>
                  </div>
                  <div className="delivery">
                    <div>
                      <span className="left-side">Vận chuyển</span>
                      <span className="right-side">Miễn phí vận chuyển</span>
                    </div>
                  </div>
                  <div className="quantity">
                    <span className="left-side">Số lượng</span>
                    <span className="right-side">
                      <button onClick={() => handleChangeButton("MINUS")}>
                        <MinusOutlined />
                      </button>
                      <input
                        onChange={(event) =>
                          handleChangeInput(event.target.value)
                        }
                        value={currentQuantity}
                      />
                      <button onClick={() => handleChangeButton("PLUS")}>
                        <PlusOutlined />
                      </button>
                    </span>
                  </div>
                  <div className="buy">
                    <button
                      className="cart"
                      onClick={() =>
                        handleAddToCart(currentQuantity, dataProduct)
                      }
                    >
                      <BsCartPlus className="icon-cart" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>

                    <button
                      className="now"
                      onClick={() => handleBuyNow(currentQuantity, dataProduct)}
                    >
                      Mua ngay
                    </button>
                  </div>
                </Col>
              </Col>
            </Row>
          ) : (
            <ProductLoader />
          )}
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
        title={dataProduct?.name}
      />
    </div>
  );
};

export default ViewDetail;
