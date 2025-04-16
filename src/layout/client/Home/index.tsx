import { FilterTwoTone, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin, Empty, Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { callFetchCategory, callFetchListProduct } from '../../../services/axios.product';
import './home.scss';
import MobileFilter from './MobileFilter';

const Home = () => {
    const [searchTerm, setSearchTerm] = useOutletContext<[string, React.Dispatch<React.SetStateAction<string>>]>();

    const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);
    const [listProduct, setListProduct] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-sold");

    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const initCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const categories = res.data.map((item: string) => ({
                    label: item,
                    value: item,
                }));
                setListCategory(categories);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [current, pageSize, filter, sortQuery, searchTerm]);

    const fetchProduct = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;
        if (searchTerm) query += `&mainText=/${searchTerm}/i`;

        const res = await callFetchListProduct(query);
        if (res && res.data) {
            setListProduct(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnChangePage = (pagination: { current: number; pageSize: number }) => {
        if (pagination.current !== current) setCurrent(pagination.current);
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const categories = values.category;
            if (categories && categories.length > 0) {
                setFilter(`category=${categories.join(',')}`);
            } else {
                setFilter('');
            }
        }
    };

    const onFinish = (values: any) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let filterQuery = `price>=${values.range.from}&price<=${values.range.to}`;
            if (values.category?.length) {
                filterQuery += `&category=${values.category.join(',')}`;
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

    const handleRedirectProduct = (product: any) => {
        const slug = product.mainText.toLowerCase().replace(/\s+/g, '-');
        navigate(`/product/${slug}?id=${product._id}`);
    };

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <Breadcrumb
                        style={{ margin: '5px 0' }}
                        items={[
                            { title: <HomeOutlined /> },
                            { title: <Link to="/">Trang Chủ</Link> },
                        ]}
                    />
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span>
                                        <FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined
                                        title="Reset"
                                        onClick={() => {
                                            form.resetFields();
                                            setFilter('');
                                            setSearchTerm('');
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
                                                    <Col span={24} key={`category-${index}`} style={{ padding: '7px 0' }}>
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
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>-</Col>
                                            <Col span={11}>
                                                <Form.Item name={["range", "to"]}>
                                                    <InputNumber
                                                        min={0}
                                                        placeholder="đ ĐẾN"
                                                        style={{ width: '100%' }}
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
                                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                    <Tabs
                                        defaultActiveKey="sort=-sold"
                                        items={items}
                                        onChange={(key) => setSortQuery(key)}
                                    />
                                    <Row className="customize-row">
                                        {listProduct.map((item, index) => (
                                            <div
                                                className="column"
                                                key={`product-${index}`}
                                                onClick={() => handleRedirectProduct(item)}
                                            >
                                                <div className="wrapper">
                                                    {/* Tạm thời comment phần hình ảnh */}
                                                    {/* <div className="thumbnail">
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`}
                                                            alt="thumbnail product"
                                                        />
                                                    </div> */}
                                                    <div className="text" title={item.mainText}>
                                                        {item.mainText}
                                                    </div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(item.price ?? 0)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate value={5} disabled style={{ fontSize: 10 }} />
                                                        <span>Đã bán {item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {listProduct.length === 0 && (
                                            <Empty description="Không có dữ liệu" />
                                        )}
                                    </Row>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        onChange={(page, size) => handleOnChangePage({ current: page, pageSize: size })}
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