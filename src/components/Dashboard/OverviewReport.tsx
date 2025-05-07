import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material';
import { DatePicker } from 'antd';
import { dashboardApi } from '../../services/axios.dashboard';
import moment from 'moment';
import CountUp from 'react-countup';
import {
    ShoppingCartOutlined,
    UserOutlined,
    DollarOutlined,
    ShoppingOutlined
} from '@ant-design/icons';

interface OverviewData {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    newUsers: number;
    newOrders: number;
    averageOrderValue: number;
}

const OverviewReport = () => {
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchOverviewData();
    }, [selectedDate]);

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.getOverviewReport(selectedDate || undefined);

            if (response.data) {
                setOverviewData(response.data);
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date ? date.toDate() : null);
    };

    // Format số tiền thành VND
    const formatVND = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const statCards = [
        {
            title: 'Tổng doanh thu',
            value: overviewData?.totalRevenue || 0,
            icon: <DollarOutlined style={{ fontSize: '28px', color: '#f5222d' }} />,
            formatter: formatVND,
            backgroundColor: '#fff1f0',
            textColor: '#f5222d'
        },
        {
            title: 'Tổng đơn hàng',
            value: overviewData?.totalOrders || 0,
            icon: <ShoppingCartOutlined style={{ fontSize: '28px', color: '#1890ff' }} />,
            formatter: (value: number) => value,
            backgroundColor: '#e6f7ff',
            textColor: '#1890ff'
        },
        {
            title: 'Tổng người dùng',
            value: overviewData?.totalUsers || 0,
            icon: <UserOutlined style={{ fontSize: '28px', color: '#52c41a' }} />,
            formatter: (value: number) => value,
            backgroundColor: '#f6ffed',
            textColor: '#52c41a'
        },
        {
            title: 'Tổng sản phẩm',
            value: overviewData?.totalProducts || 0,
            icon: <ShoppingOutlined style={{ fontSize: '28px', color: '#722ed1' }} />,
            formatter: (value: number) => value,
            backgroundColor: '#f9f0ff',
            textColor: '#722ed1'
        },
        {
            title: 'Khách hàng mới',
            value: overviewData?.newUsers || 0,
            icon: <UserOutlined style={{ fontSize: '28px', color: '#fa8c16' }} />,
            formatter: (value: number) => value,
            backgroundColor: '#fff7e6',
            textColor: '#fa8c16'
        },
        {
            title: 'Đơn hàng mới',
            value: overviewData?.newOrders || 0,
            icon: <ShoppingCartOutlined style={{ fontSize: '28px', color: '#13c2c2' }} />,
            formatter: (value: number) => value,
            backgroundColor: '#e6fffb',
            textColor: '#13c2c2'
        },
        {
            title: 'Giá trị đơn trung bình',
            value: overviewData?.averageOrderValue || 0,
            icon: <DollarOutlined style={{ fontSize: '28px', color: '#eb2f96' }} />,
            formatter: formatVND,
            backgroundColor: '#fff0f6',
            textColor: '#eb2f96'
        }
    ];

    return (
        <Card>
            <CardHeader
                title="Báo cáo tổng quan"
                action={
                    <DatePicker
                        placeholder="Chọn ngày"
                        format="DD/MM/YYYY"
                        onChange={handleDateChange}
                        allowClear={true}
                    />
                }
            />
            <CardContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {statCards.map((card, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card elevation={3}>
                                    <CardContent sx={{ backgroundColor: card.backgroundColor }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ mr: 2 }}>{card.icon}</Box>
                                            <Typography variant="h6" sx={{ color: card.textColor }}>
                                                {card.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h4" sx={{ color: card.textColor, fontWeight: 500 }}>
                                            <CountUp
                                                end={card.value}
                                                formattingFn={card.formatter}
                                                duration={2}
                                            />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CardContent>
        </Card>
    );
};

export default OverviewReport; 