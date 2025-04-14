import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>Về Chúng Tôi</h3>
                    <ul>
                        <li>Giới thiệu</li>
                        <li>Điều khoản dịch vụ</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Hỗ Trợ</h3>
                    <ul>
                        <li>Trung tâm trợ giúp</li>
                        <li>Hướng dẫn mua hàng</li>
                        <li>Chính sách đổi trả</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Liên Hệ</h3>
                    <ul>
                        <li>Email: support@example.com</li>
                        <li>Hotline: 1900 1000</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Theo Dõi Chúng Tôi</h3>
                    <ul>
                        <li>Facebook</li>
                        <li>Zalo</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                © 2025 - Bản quyền thuộc về Nhóm
            </div>
        </footer>
    );
}

export default Footer;
