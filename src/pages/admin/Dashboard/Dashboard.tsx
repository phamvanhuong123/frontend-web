import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import OverviewReport from "../../../components/Dashboard/OverviewReport";
import RevenueChart from "../../../components/Dashboard/RevenueChart";
import OrderChart from "../../../components/Dashboard/OrderChart";
import TopSellingProducts from "../../../components/Dashboard/TopSellingProducts";
import OrderStatusChart from "../../../components/Dashboard/OrderStatusChart";
import { useEffect, useState } from "react";
import { dashboardApi } from "../../../services/axios.dashboard";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra kết nối API khi component mount
    const checkApiConnection = async () => {
      try {
        // Gọi API tổng quan để kiểm tra kết nối
        await dashboardApi.getOverviewReport();
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
        setError(err.message || "Không thể kết nối đến API báo cáo");
        setIsLoading(false);
      }
    };

    checkApiConnection();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Lỗi kết nối: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Báo cáo tổng quan */}
        <OverviewReport />

        {/* Biểu đồ */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Biểu đồ doanh thu */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <RevenueChart />
          </Box>

          {/* Biểu đồ đơn hàng */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <OrderChart />
          </Box>
        </Stack>

        {/* Biểu đồ khác */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Phân bổ trạng thái đơn hàng */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <OrderStatusChart />
          </Box>

          {/* Top sản phẩm bán chạy */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <TopSellingProducts />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Dashboard;
