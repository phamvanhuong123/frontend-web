import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, Box, Typography, CircularProgress } from '@mui/material';
import { dashboardApi } from '../../services/axios.dashboard';

// OrderStatus enum ứng với public enum OrderStatus
const OrderStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELED: "CANCELED",
    RETURNED: "RETURNED",
    COMPLETED: "COMPLETED"
};

interface StatusData {
    name: string;
    value: number;
    status: string;
}

const OrderStatusChart = () => {
    const [statusData, setStatusData] = useState<StatusData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchOrderStatusData();
    }, []);

    const fetchOrderStatusData = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.getOrderStatusStatistics();

            if (response.data && Array.isArray(response.data)) {
                const formattedData = response.data.map((item: any) => ({
                    name: getStatusName(item.status),
                    value: item.count,
                    status: item.status // Lưu lại status để dùng cho màu sắc
                }));

                setStatusData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching order status data:', error);
            // Dữ liệu mẫu fallback khi API lỗi
            const mockData = [
                { status: OrderStatus.PENDING, count: 12 },
                { status: OrderStatus.PROCESSING, count: 18 },
                { status: OrderStatus.SHIPPED, count: 8 },
                { status: OrderStatus.DELIVERED, count: 25 },
                { status: OrderStatus.CANCELED, count: 5 },
                { status: OrderStatus.RETURNED, count: 3 },
                { status: OrderStatus.COMPLETED, count: 30 },
            ];

            const formattedData = mockData.map(item => ({
                name: getStatusName(item.status),
                value: item.count,
                status: item.status
            }));

            setStatusData(formattedData);
        } finally {
            setLoading(false);
        }
    };

    // Chuyển đổi mã trạng thái thành tên trạng thái tiếng Việt
    const getStatusName = (status: string): string => {
        const statusMap: { [key: string]: string } = {
            [OrderStatus.PENDING]: 'Chờ xác nhận',
            [OrderStatus.PROCESSING]: 'Đang xử lý',
            [OrderStatus.SHIPPED]: 'Đang giao hàng',
            [OrderStatus.DELIVERED]: 'Đã giao hàng',
            [OrderStatus.CANCELED]: 'Đã hủy',
            [OrderStatus.RETURNED]: 'Đã trả hàng',
            [OrderStatus.COMPLETED]: 'Hoàn thành'
        };
        return statusMap[status] || status;
    };

    // Màu sắc cho từng trạng thái
    const getColorForStatus = (status: string): string => {
        const statusColorMap: { [key: string]: string } = {
            [OrderStatus.PENDING]: '#FFBB28', // Vàng
            [OrderStatus.PROCESSING]: '#0088FE', // Xanh dương
            [OrderStatus.SHIPPED]: '#00C49F', // Xanh lá
            [OrderStatus.DELIVERED]: '#8884d8', // Tím nhạt
            [OrderStatus.CANCELED]: '#FF5252', // Đỏ
            [OrderStatus.RETURNED]: '#FF8042', // Cam
            [OrderStatus.COMPLETED]: '#4CAF50' // Xanh lá đậm
        };
        return statusColorMap[status] || '#999';
    };

    // Tooltip hiển thị khi hover
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = statusData.reduce((sum, item) => sum + item.value, 0);
            const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';

            return (
                <Box sx={{
                    backgroundColor: 'white',
                    p: 1.5,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: getColorForStatus(data.status) }}>
                        {data.name}
                    </Typography>
                    <Typography variant="body2">
                        Số lượng: {data.value}
                    </Typography>
                    <Typography variant="body2">
                        Tỷ lệ: {percentage}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    // Nhãn hiển thị trong biểu đồ
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    // Custom Legend component
    const CustomLegend = ({ payload }: any) => {
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, mt: 2, maxHeight: 350, overflowY: 'auto' }}>
                {payload.map((entry: any, index: number) => (
                    <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                mr: 1,
                                borderRadius: 0.5,
                                backgroundColor: entry.color
                            }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {entry.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {entry.payload.value} đơn hàng
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Card>
            <CardHeader title="Biểu đồ trạng thái đơn hàng" />
            <CardContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                        <CircularProgress />
                    </Box>
                ) : statusData.length > 0 ? (
                    <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="45%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={160}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getColorForStatus(entry.status)}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    content={<CustomLegend />}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ paddingLeft: 20, right: 0, width: '30%' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                        <Typography color="text.secondary">Không có dữ liệu trạng thái đơn hàng</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderStatusChart;