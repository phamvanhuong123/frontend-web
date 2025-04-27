import "./home.scss";
import { FilterTwoTone, ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  Spin,
  Empty,
  Breadcrumb,
  Radio,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { callFetchCategory, productApi } from "../../../services/axios.product";
import { getImageUrl } from "../../../config/config";
import MobileFilter from "./MobileFilter";
import { PaginationResponse, ProductQueryParameters } from "~/types/product";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";


const Home = () => {
  const [searchTerm, setSearchTerm] =
    useOutletContext<[string, React.Dispatch<React.SetStateAction<string>>]>();

  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [listProduct, setListProduct] = useState<
    { price: number; rating?: number; sold?: number; name: string; images?: { url: string }[]; id?: string | number; [key: string]: any }[]
  >([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [formFilterValues, setFormFilterValues] = useState<{
      category?: string;
      range?: { from?: number; to?: number };
  }>({});

  const [sortBy, setSortBy] = useState<string | null>('Sold');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('desc');

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchProduct = async () => {
  setIsLoading(true);
  try {
    const params: ProductQueryParameters = {
      pageIndex: current,
      pageSize: pageSize,
      searchTerm: searchTerm || null,
      sortBy: sortBy || null,
      sortOrder: sortOrder || null,
    };
    // Xử lý lọc theo danh mục
   
    if (formFilterValues.category && formFilterValues.category.length > 0) {
      params.categoryId = formFilterValues.category; 
    }

    // Xử lý lọc theo khoảng giá
    if (formFilterValues.range?.from !== undefined && formFilterValues.range.from !== null) {
      params.minPrice = formFilterValues.range.from;
    }

    if (formFilterValues.range?.to !== undefined && formFilterValues.range.to !== null) {
      params.maxPrice = formFilterValues.range.to;
    }

    const res: PaginationResponse<any> = await productApi.getAllPage(params);

    if (res) {
      setListProduct(res.items);
      setTotal(res.totalCount);
    } else {
      setListProduct([]);
      setTotal(0);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    setListProduct([]);
    setTotal(0);
  } finally {
    setIsLoading(false);
  }
};

  const initCategory = async () => {
    const res = await callFetchCategory();
    if (res && res.data) {
      const categories = res.data.map((item: any) => ({
        label: item.name || item,
        value: String(item.id),
      }));
      setListCategory(categories);
    }
  };

  useEffect(() => {
    initCategory();
    handleSortChange(items[0].key);
  }, []);

  useEffect(() => {
      fetchProduct();
  }, [current, pageSize, sortBy, sortOrder, searchTerm]);


  const bannerImages = ["/banner5.png", "/banner7.jpg"];
  const carouselRef = useRef<any>(null);
  const news = [
    {
      id: 1,
      title: "Giảm giá cực sốc dịp lễ 30/4! Yến sào Hoàng Gia Quy Nhơn",
      date: "2025-04-20",
      image: "/bl62.webp",
    },
    {
      id: 2,
      title: "5 sản phẩm bán chạy nhất tháng 4 của Yến sào Hoàng Gia Quy Nhơn",
      date: "2025-04-18",
      image: "/yen block.webp",
    },
    {
      id: 3,
      title: "Cập nhật xu hướng mua sắm 2025 của Yến sào Hoàng Gia Quy Nhơn",
      date: "2025-04-15",
      image: "/yen.jpg",
    },
  ];

  const handleChangeFilter = (changedValues: any, allValues: any) => {
    setFormFilterValues(allValues);
  };

  const onFinish = (values: any) => {
  setCurrent(1);
    fetchProduct();
  };

  const items = [
    { key: "-Sold", label: `Phổ biến` },
    { key: "-UpdatedAt", label: `Hàng Mới` },
    { key: "Price", label: `Giá Thấp Đến Cao` },
    { key: "-Price", label: `Giá Cao Đến Thấp` },
  ];

const handleSortChange = (key: string) => {
  if (key.startsWith('-')) {
    setSortBy(key.substring(1));
    setSortOrder('desc');
  } else {
    setSortBy(key);
    setSortOrder('asc');
  }
  setCurrent(1); // Reset về trang đầu tiên khi thay đổi sắp xếp
};


  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleRedirectProduct = (product: any) => {
    const name = product.name ?? "";

    const slug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    navigate(`/products?slug=${slug}`);
  };

  return (
    <>
      <div style={{ background: "#efefef", padding: "20px 0" }}>
        <div
          className="homepage-container"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          <div style={{ position: "relative", marginBottom: 20 }}>
            {/* Carousel chính có ref */}
            <Carousel autoplay ref={carouselRef} effect="fade">
              {bannerImages.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`banner-${index}`}
                    style={{
                      width: "100%",
                      height: 450,
                      objectFit: "cover",
                      borderRadius: 8,
                      backgroundColor: "#f5f5f5",
                      filter: "brightness(0.85)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10%",
                      transform: "translateY(-50%)",
                      color: "#fff",
                      fontSize: 32,
                      fontWeight: "bold",
                      textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                  </div>
                </div>
              ))}
            </Carousel>

            {/* Nút mũi tên trái */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 20,
                transform: "translateY(-50%)",
                background: "#fff",
                borderRadius: "50%",
                padding: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                cursor: "pointer",
                zIndex: 1,
              }}
              onClick={() => carouselRef.current?.prev()}
            >
              <LeftOutlined />
            </div>

            {/* Nút mũi tên phải */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 20,
                transform: "translateY(-50%)",
                background: "#fff",
                borderRadius: "50%",
                padding: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                cursor: "pointer",
                zIndex: 1,
              }}
              onClick={() => carouselRef.current?.next()}
            >
              <RightOutlined />
            </div>
          </div>
          <Breadcrumb
            style={{ margin: "5px 0" }}
            items={[
              { title: <HomeOutlined /> },
              { title: <Link to="/">Trang Chủ</Link> },
            ]}
          />
          <Row gutter={[20, 20]}>
            <Col md={4} sm={0} xs={0}>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    <FilterTwoTone />
                    <span style={{ fontWeight: 500, fontSize: 18 }}>
                      {" "}
                      Bộ lọc tìm kiếm
                    </span>
                  </span>
                  <ReloadOutlined
                    title="Reset"
                    onClick={() => {
                      form.resetFields();
                      setFormFilterValues({});
                      setSearchTerm("");
                      setSortBy('Sold');
                      setSortOrder('desc');
                    }}
                  />
                </div>
                <Divider />
                <Form
                  onFinish={onFinish}
                  form={form}
                  onValuesChange={handleChangeFilter}
                >
                  <Form.Item
                    name="category"
                    label="Danh mục sản phẩm"
                    labelCol={{ span: 24 }}
                  >
                   <Radio.Group>
    <Row>
      {listCategory.map((item, index) => (
        <Col
          span={24}
          key={`category-${index}`}
          style={{ padding: "7px 0" }}
        >
          <Radio value={item.value}>{item.label}</Radio>
        </Col>
      ))}
    </Row>
  </Radio.Group>
                  </Form.Item>
                  <Divider />
                  <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
  <Row gutter={[10, 10]}>
    <Col span={11}>
      <Form.Item name={["range", "from"]}>
        <InputNumber<number>
          min={0}
          placeholder="Từ"
          style={{ width: "100%" }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
        />
      </Form.Item>
    </Col>
    <Col span={2} style={{ textAlign: 'center' }}>-</Col>
    <Col span={11}>
      <Form.Item 
        name={["range", "to"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const from = getFieldValue(['range', 'from']);
              if (!value || !from || Number(value) >= Number(from)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Giá đến phải lớn hơn giá từ'));
            },
          }),
        ]}
      >
        <InputNumber<number>
          min={0}
          placeholder="Đến"
          style={{ width: "100%" }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || "0")}
        />
      </Form.Item>
    </Col>
  </Row>
  <Button
    onClick={() => form.submit()}
    style={{ width: "100%" }}
    type="primary"
  >
    Áp dụng
  </Button>
</Form.Item>
</Form>
              </div>
            </Col>
            <Col md={20} xs={24}>
              <Spin spinning={isLoading} tip="Loading...">
                <div
                  style={{
                    padding: "20px",
                    background: "#fff",
                    borderRadius: 5,
                  }}
                >
                  <Tabs
                    activeKey={sortBy ? (sortOrder === 'desc' ? `-${sortBy}` : sortBy) : items[0].key}
                    items={items}
                    onChange={handleSortChange}
                  />
                  <Row className="customize-row"  gutter={[10, 10]}>
                    {listProduct.map((item) => (
                      <Col
                        xl={{ span: 6 }}
                        lg={{ span: 8 }}
                        sm={{ span: 12 }}
                        xs={{ span: 24 }}
                        className="column"
                        key={`product-${item.id}`}
                        onClick={() => handleRedirectProduct(item)}
                      >
                        <div className="wrapper">
                          <div className="thumbnail">
                            <img
                              src={getImageUrl(item.images?.[0]?.url || '')}
                              alt={item.name}
                            />
                          </div>
                          <div className="text" title={item.name}>
                            {item.name}
                          </div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price ?? 0)}
                          </div>
                          <div className="rating">
                            <Rate
                              value={item.rating || 5}
                              disabled
                              style={{ fontSize: 10 }}
                            />
                            <span>Đã bán {item.sold || 0}</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                    {listProduct.length === 0 && !isLoading && (
                      <Empty description="Không có sản phẩm nào" />
                    )}
                  </Row>
                  <Pagination
                    style={{ marginTop: 10 }}
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    onChange={(page, size) => {
                      setCurrent(page);
                      if (size !== pageSize) {
                        setPageSize(size);
                      }
                    }}
                    showSizeChanger
                    pageSizeOptions={["12", "24", "36", "48"]}
                    defaultPageSize={12}
                  />
                </div>
              </Spin>
            </Col>
          </Row>
          <MobileFilter
            isOpen={showMobileFilter}
            setIsOpen={setShowMobileFilter}
            handleChangeFilter={handleChangeFilter}
            listCategory={listCategory}
            onFinish={onFinish}
            form={form}
          />
          <div style={{ padding: "40px 0" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
              📰 Tin Tức Mới Nhất
            </h2>
            <Row gutter={[24, 24]}>
              {news.map((item) => (
                <Col xs={24} sm={12} md={8} key={item.id}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "contain",
                      }}
                    />
                    <div style={{ padding: 16, flex: 1 }}>
                      <div
                        style={{ color: "#999", fontSize: 13, marginBottom: 8 }}
                      >
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#222",
                          marginBottom: 12,
                        }}
                      >
                        {item.title}
                      </h3>
                      <Link
                        to={`/news/${item.id}`}
                        style={{ color: "#1890ff" }}
                      >
                        Xem thêm &rsaquo;
                      </Link>
                  </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;