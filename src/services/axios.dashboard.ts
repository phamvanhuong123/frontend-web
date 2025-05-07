import axios from './axios.customize';

const dashboardApi = {
    // Lấy danh sách sản phẩm bán chạy nhất
    getTopSellingProducts: (top: number = 10) => {
        return axios.get(`/api/v1/ecommerce/reports/top-selling-products?top=${top}`);
    },

    // Lấy thống kê trạng thái đơn hàng
    getOrderStatusStatistics: () => {
        return axios.get('/api/v1/ecommerce/reports/order-status-statistics');
    },

    // Lấy báo cáo doanh thu
    getRevenueReport: () => {
        return axios.get('/api/v1/ecommerce/reports/revenue-report');
    },

    // Lấy báo cáo số đơn hàng theo ngày
    getDailyOrderReport: (startDate: Date, endDate: Date) => {
        return axios.get(`/api/v1/ecommerce/reports/daily-order-report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    },

    // Lấy báo cáo doanh thu theo ngày
    getDailyRevenueReport: (startDate: Date, endDate: Date) => {
        return axios.get(`/api/v1/ecommerce/reports/daily-revenue-report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    },

    // Lấy báo cáo tổng quan
    getOverviewReport: (date?: Date) => {
        const queryParam = date ? `?date=${date.toISOString()}` : '';
        return axios.get(`/api/v1/ecommerce/reports/overview-report${queryParam}`);
    }
};

export { dashboardApi }; 