import axios from './axios.customize';
const url = "api/v1/ecommerce/reports";
const dashboardApi = {
    // Lấy danh sách sản phẩm bán chạy nhất
    getTopSellingProducts: (top: number = 10) => {
        return axios.get(`${url}/top-selling-products?top=${top}`);
    },

    // Lấy thống kê trạng thái đơn hàng
    getOrderStatusStatistics: () => {
        return axios.get('${url}/order-status-statistics');
    },

    // Lấy báo cáo doanh thu
    getRevenueReport: () => {
        return axios.get('${url}/revenue-report');
    },

    // Lấy báo cáo số đơn hàng theo ngày
    getDailyOrderReport: (startDate: Date, endDate: Date) => {
        return axios.get(`${url}/daily-order-report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    },

    // Lấy báo cáo doanh thu theo ngày
    getDailyRevenueReport: (startDate: Date, endDate: Date) => {
        return axios.get(`${url}/daily-revenue-report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    },

    // Lấy báo cáo tổng quan
    getOverviewReport: (date?: Date) => {
        const queryParam = date ? `?date=${date.toISOString()}` : '';
        return axios.get(`${url}/overview-report${queryParam}`);
    }
};

export { dashboardApi }; 