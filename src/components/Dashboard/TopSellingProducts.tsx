import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, Box, Typography, CircularProgress, Slider } from '@mui/material';
import { dashboardApi } from '../../services/axios.dashboard';

interface TopProduct {
    name: string;
    quantity: number;
    revenue: number;
}

const TopSellingProducts = () => {
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [topCount, setTopCount] = useState<number>(5);

    useEffect(() => {
        fetchTopProducts();
    }, [topCount]);

    const fetchTopProducts = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.getTopSellingProducts(topCount);

            if (response.data && Array.isArray(response.data)) {
                const formattedData = response.data.map((item: any) => ({
                    name: item.productName,
                    quantity: item.quantitySold,
                    revenue: item.totalRevenue
                }));

                setTopProducts(formattedData);
            }
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);
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
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#8884d8' }}>
                        {`Số lượng bán: ${payload[0].value}`}
                    </Typography>
                    {payload[1] && (
                        <Typography variant="body2" sx={{ color: '#82ca9d' }}>
                            {`Doanh thu: ${formatVND(payload[1].value)}`}
                        </Typography>
                    )}
                </Box>
            );
        }
        return null;
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setTopCount(newValue as number);
    };

    return (
        <Card>
            <CardHeader
                title="Top sản phẩm bán chạy nhất"
                action={
                    <Box sx={{ width: 150, mr: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Hiển thị top {topCount}
                        </Typography>
                        <Slider
                            value={topCount}
                            min={3}
                            max={20}
                            step={1}
                            onChange={handleSliderChange}
                            aria-label="Top products"
                            valueLabelDisplay="auto"
                        />
                    </Box>
                }
            />
            <CardContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={topProducts.length * 60 + 50}>
                        <BarChart
                            data={topProducts}
                            layout="vertical"
                            margin={{ top: 20, right: 60, left: 150, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                width={150}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="quantity"
                                name="Số lượng bán"
                                fill="#8884d8"
                                barSize={20}
                                radius={[0, 4, 4, 0]}
                            >
                                <LabelList dataKey="quantity" position="right" style={{ fill: '#8884d8' }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography>Không có dữ liệu sản phẩm bán chạy</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TopSellingProducts; 