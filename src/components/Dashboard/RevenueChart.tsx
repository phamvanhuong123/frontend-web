import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
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

interface DailyRevenue {
    date: string;
    totalRevenue: number;
}

const RevenueChart = () => {
    const [revenueData, setRevenueData] = useState<DailyRevenue[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        moment().subtract(7, 'days').toDate(),
        moment().toDate()
    ]);

    useEffect(() => {
        fetchRevenueData();
    }, [dateRange]);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.getDailyRevenueReport(dateRange[0], dateRange[1]);

            if (response.data && Array.isArray(response.data)) {
                const formattedData = response.data.map((item: any) => ({
                    date: moment(item.date).format('DD/MM'),
                    totalRevenue: item.totalRevenue
                }));

                setRevenueData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0].toDate(), dates[1].toDate()]);
        }
    };

    // Format số tiền thành VND
    const formatVND = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
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
                    <Typography variant="body2" sx={{ color: '#1890ff' }}>
                        {`Doanh thu: ${formatVND(payload[0].value)}`}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader
                title="Biểu đồ doanh thu theo ngày"
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
                ) : revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={revenueData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                tickFormatter={(value) => {
                                    return value >= 1000000
                                        ? `${(value / 1000000).toFixed(0)}M`
                                        : value >= 1000
                                            ? `${(value / 1000).toFixed(0)}K`
                                            : value;
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="totalRevenue"
                                name="Doanh thu"
                                stroke="#1890ff"
                                strokeWidth={2}
                                dot={{ fill: '#1890ff', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography>Không có dữ liệu doanh thu trong khoảng thời gian này</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RevenueChart; 