import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, Box, Typography, CircularProgress } from '@mui/material';
import { DatePicker, Space } from 'antd';
import { dashboardApi } from '../../services/axios.dashboard';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface DailyOrder {
    date: string;
    totalOrders: number;
}

const OrderChart = () => {
    const [orderData, setOrderData] = useState<DailyOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        moment().subtract(7, 'days').toDate(),
        moment().toDate()
    ]);

    useEffect(() => {
        fetchOrderData();
    }, [dateRange]);

    const fetchOrderData = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.getDailyOrderReport(dateRange[0], dateRange[1]);

            if (response.data && Array.isArray(response.data)) {
                const formattedData = response.data.map((item: any) => ({
                    date: moment(item.date).format('DD/MM'),
                    totalOrders: item.totalOrders
                }));

                setOrderData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0].toDate(), dates[1].toDate()]);
        }
    };

    // Custom tooltip hiển thị khi hover
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    backgroundColor: 'white',
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="subtitle2">{`Ngày: ${label}`}</Typography>
                    <Typography variant="body2" sx={{ color: '#52c41a' }}>
                        {`Số đơn hàng: ${payload[0].value}`}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader
                title="Biểu đồ số lượng đơn hàng theo ngày"
                action={
                    <Space direction="horizontal">
                        <RangePicker
                            format="DD/MM/YYYY"
                            defaultValue={[
                                moment(dateRange[0]),
                                moment(dateRange[1])
                            ]}
                            onChange={handleDateChange}
                        />
                    </Space>
                }
            />
            <CardContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : orderData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={orderData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="totalOrders"
                                name="Số đơn hàng"
                                fill="#52c41a"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography>Không có dữ liệu đơn hàng trong khoảng thời gian này</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderChart; 