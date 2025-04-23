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
} from "antd";
import { useEffect, useState } from "react";
import { Link, Route, useNavigate, useOutletContext } from "react-router-dom";
import { callFetchCategory, productApi } from "../../../services/axios.product";
import { getImageUrl } from "../../../config/config";
import MobileFilter from "./MobileFilter";
import { ProductQueryParameters } from "~/types/product";
import ProductPage from "~/pages/client/product";

const Home = () => {
  const [searchTerm, setSearchTerm] =
    useOutletContext<[string, React.Dispatch<React.SetStateAction<string>>]>();

  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [listProduct, setListProduct] = useState<
    { price: number; [key: string]: any }[]
  >([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-sold");

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const params: ProductQueryParameters = {
        pageIndex: current,
        pageSize: pageSize,
      };

      // Thêm các điều kiện filter
      if (filter) {
        const filterParams = new URLSearchParams(filter);
        if (filterParams.has("category")) {
            params.category = filterParams.get("category") || "";
        }
        if (filter.includes("price>=") && filter.includes("price<=")) {
          const [from, to] = filter.match(/\d+/g) || [];
          params.priceFrom = Number(from);
          params.priceTo = Number(to);
        }
      }

      // Thêm sort
      if (sortQuery) {
        params.sort = sortQuery.replace("sort=", "");
      }

      // Thêm search term
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }

      const res = await productApi.getAllPage(params);

      if (res) {
        setListProduct(res.items); // items chứa danh sách sản phẩm
        setTotal(res.totalCount); // totalCount chứa tổng số bản ghi
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

  //cate
  const initCategory = async () => {
    const res = await callFetchCategory();
    if (res && res.data) {
      const categories = res.data.map((item: any) => ({
        label: item.name || item,
        value: item.id || item,
      }));
      setListCategory(categories);
    }
  };

  useEffect(() => {
    initCategory(); // Chỉ gọi một lần khi component được render
  }, []);
  useEffect(() => {
    fetchProduct();
    initCategory();
  }, [current, pageSize, filter, sortQuery, searchTerm]);

  const handleChangeFilter = (changedValues: any, values: any) => {
    const filters: string[] = [];
    // Xử lý filter theo danh mục
    if (values.category && values.category.length > 0) {
      filters.push(`category=${values.category.join(",")}`);
    }

    // Xử lý filter theo khoảng giá
    if (values.range?.from !== undefined && values.range?.to !== undefined) {
      filters.push(`price>=${values.range.from}`);

      filters.push(`price<=${values.range.to}`);
    }

    // Kết hợp tất cả các filter
    setFilter(filters.join("&"));
  };

  const onFinish = (values: any) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let filterQuery = `price>=${values.range.from}&price<=${values.range.to}`;
      if (values.category?.length) {
        filterQuery += `&category=${values.category.join(",")}`;
      }
      setFilter(filterQuery);
    }
  };

  const items = [
    { key: "sort=-sold", label: `Phổ biến` },
    { key: "sort=-updatedAt", label: `Hàng Mới` },
    { key: "sort=price", label: `Giá Thấp Đến Cao` },
    { key: "sort=-price", label: `Giá Cao Đến Thấp` },
  ];

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // xóa dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };
  
  const handleRedirectProduct = (product: any) => {
    const name = product.name ?? '';
    
    const slug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  
      .replace(/\s+/g, '-')     
      .replace(/-+/g, '-');      
    navigate(`/products?slug=${slug}`);
  };
  
  

  return (
    <>
      <div style={{ background: "#efefef", padding: "20px 0" }}>
        <div
          className="homepage-container"
          style={{ maxWidth: 1440, margin: "0 auto" }}
        >
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
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    <FilterTwoTone />
                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                  </span>
                  <ReloadOutlined
                    title="Reset"
                    onClick={() => {
                      form.resetFields();
                      setFilter("");
                      setSearchTerm("");
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
                    <Checkbox.Group>
                      <Row>
                        {listCategory.map((item, index) => (
                          <Col
                            span={24}
                            key={`category-${index}`}
                            style={{ padding: "7px 0" }}
                          >
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                  <Divider />
                  <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                    <Row gutter={[10, 10]}>
                      <Col span={11}>
                        <Form.Item name={["range", "from"]}>
                          <InputNumber
                            min={0}
                            placeholder="đ TỪ"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>-</Col>
                      <Col span={11}>
                        <Form.Item name={["range", "to"]}>
                          <InputNumber
                            min={0}
                            placeholder="đ ĐẾN"
                            style={{ width: "100%" }}
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
                    defaultActiveKey="sort=-sold"
                    items={items}
                    onChange={(key) => setSortQuery(key)}
                  />
                  <Row className="customize-row" gutter={[10,10]}>
                    {listProduct.map((item) => (
                      <Col xl={{span : 6}} lg={{span : 8}} sm={{span : 12}} xs={{span : 24}}
                        className="column"
                        key={`product-${item.id}`}
                        onClick={() => handleRedirectProduct(item)}
                      >
                        <div className="wrapper">
                          <div className="thumbnail">
                          <img
                            src={getImageUrl(item.images?.[0]?.url)}
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
                    pageSizeOptions={["10", "20", "30", "40"]}
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
          />
        </div>
      </div>
    </>
  );
};

export default Home;
