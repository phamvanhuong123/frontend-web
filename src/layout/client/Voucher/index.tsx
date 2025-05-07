import { useState, useEffect } from "react";
import { Tabs, Button, message, Spin, Empty, Tag } from "antd";
import { useSelector } from "react-redux";
import { couponApi } from "~/services/axios.coupon";
import "./vouchers.scss";
import Coupon from "~/types/coupon";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const Vouchers = () => {
  const [allVouchers, setAllVouchers] = useState<Coupon[]>([]);
  const [savedVouchers, setSavedVouchers] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.account.user);
  const navigate = useNavigate();

  // Format ngày thành DD/MM/YYYY HH:mm:ss
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Kiểm tra nếu ngày không hợp lệ
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Đếm ngược thời gian hết hạn
  const startCountdown = (endTime: string | undefined, elementId: string) => {
    if (!endTime) return;
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeLeft = new Date(endTime).getTime() - now.getTime();
      if (timeLeft <= 0) {
        countdownElement.textContent = "Hết hạn";
        clearInterval(interval);
        return;
      }
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      countdownElement.textContent = `(${days}d ${hours}h ${minutes}m)`;
    }, 1000);
  };

  // Lấy danh sách tất cả voucher
  const fetchAllVouchers = async () => {
    setLoading(true);
    try {
      const response = await couponApi.getActiveCoupons(true, user?.id);
      setAllVouchers(response.data);
    } catch {
      message.error("Không thể tải danh sách voucher!");
    }
    setLoading(false);
  };

  // Lấy danh sách voucher đã lưu
  const fetchSavedVouchers = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await couponApi.getSavedCoupons(user.id);
      setSavedVouchers(response.data);
    } catch {
      message.error("Không thể tải danh sách voucher đã lưu!");
    }
    setLoading(false);
  };

  // Lưu voucher
  const saveVoucher = async (couponCode: string) => {
    if (!user?.id) {
      message.warning("Vui lòng đăng nhập để lưu voucher!");
      return;
    }
    setLoading(true);
    try {
      const response = await couponApi.saveCoupon(user.id, couponCode);

      // Cập nhật số lượng của voucher còn lại : usageLimit - 1
      setAllVouchers((prev) =>
        prev.map((coupon) => {
          if (coupon.code === couponCode) {
            couponApi.update(coupon.id, {
              ...coupon,
              usageLimit: (coupon.usageLimit || 0) - 1,
            });
            return {
              ...coupon,
              usageLimit: (coupon.usageLimit || 0) - 1,
            };
          }
          return coupon;
        })
      );

      message.success(response.data.message);
      fetchSavedVouchers(); // Cập nhật danh sách voucher đã lưu
      fetchAllVouchers(); // Cập nhật danh sách tất cả voucher
    } catch (error: any) {
      message.error(error.response?.data?.message || "Không thể lưu voucher!");
    }
    setLoading(false);
  };

  // Khởi động đếm ngược khi voucher thay đổi
  useEffect(() => {
    allVouchers.forEach((coupon) => {
      if (coupon.endTime) {
        startCountdown(coupon.endTime, `countdown-${coupon.id}`);
      }
    });
  }, [allVouchers]);

  useEffect(() => {
    savedVouchers.forEach((coupon) => {
      if (coupon.endTime) {
        startCountdown(coupon.endTime, `countdown-${coupon.id}`);
      }
    });
  }, [savedVouchers]);

  useEffect(() => {
    fetchAllVouchers();
    if (user?.id) {
      fetchSavedVouchers();
    }
  }, [user?.id]);

  // Render thẻ voucher
  const renderVoucherCard = (coupon: Coupon, isSavedTab: boolean = false) => {
    const isSaved = savedVouchers.some((saved) => saved.id === coupon.id);
    const isActive =
      coupon.isActive && new Date(coupon.endTime || "") > new Date();
    const discountText =
      coupon.discountType === "PERCENTAGE"
        ? `Giảm ${coupon.value}% Giảm tối đa ${coupon.value * 1000}k`
        : `Giảm ${coupon.value}k`;
    const conditionText = `Đơn Tối Thiểu ${coupon.minimumSpend}k`;
    // const categoryText = coupon.category || "Tổng Hợp";

    return (
      <div key={coupon.id} className="voucher-card">
        <div className="voucher-left">
          <div className="voucher-icon">🎟️</div>
          <div className="voucher-category">{coupon.code}</div>
        </div>
        <div className="voucher-middle">
          <div className="voucher-discount">{discountText}</div>
          <div className="voucher-condition">{conditionText}</div>
          <div className="voucher-expiry">
            HSD: {formatDate(coupon.endTime)}{" "}
            <span id={`countdown-${coupon.id}`}></span>
          </div>
        </div>
        <div className="voucher-right">
          {!isSavedTab && coupon.usageLimitPerUser && (
            <Tag className="voucher-quantity" color="red">
              x{coupon.usageLimit}
            </Tag>
          )}
          {isSavedTab && coupon.usageLimitPerUser && (
            <Tag className="voucher-quantity" color="red">
              x{coupon.usageLimitPerUser}
            </Tag>
          )}
          {!isSavedTab && !isSaved && (
            <Button
              className="voucher-button"
              onClick={() => saveVoucher(coupon.code)}
              disabled={!isActive}
              loading={loading}
            >
              Lưu
            </Button>
          )}
          {isSavedTab && isActive && (
            <Button
              className="voucher-button"
              onClick={() => navigate("/cart")}
            >
              Dùng ngay
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="vouchers-container">
      <h1>Kho Voucher</h1>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" className="voucher-tabs">
          <TabPane tab="Tất cả Voucher" key="1">
            {allVouchers.length > 0 ? (
              <div className="voucher-list">
                {allVouchers.map((coupon) => renderVoucherCard(coupon))}
              </div>
            ) : (
              <Empty description="Không có voucher nào!" />
            )}
          </TabPane>
          <TabPane tab="Voucher của tôi" key="2">
            {savedVouchers.length > 0 ? (
              <div className="voucher-list">
                {savedVouchers.map((coupon) => renderVoucherCard(coupon, true))}
              </div>
            ) : (
              <Empty description="Bạn chưa lưu voucher nào!" />
            )}
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default Vouchers;
