import './footer.scss';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>VỀ YẾN SÀO HOÀNG GIA</h4>
          <p>Chuyên cung cấp yến sào nguyên chất, đảm bảo chất lượng và sức khỏe.</p>
          <p>Đội ngũ nhân viên tận tâm, chuyên nghiệp.</p>
          <p>Địa chỉ: 55 Trần Bình Trọng - Phường Lê Lợi - TP. Quy Nhơn - Bình Định</p>
          <p>Giám Đốc : 0939.200.779 ( Mr.Phong )</p>
          <p>Kinh Doanh : 0932.900.779 ( Ms.Thi )</p>

        </div>

        <div className="footer-column">
          <h4>HỖ TRỢ KHÁCH HÀNG</h4>
          <ul>
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>KẾT NỐI</h4>
          <div className="social-icons">
            <a href="#"><FacebookIcon></FacebookIcon></a>
            <a href="#"><InstagramIcon></InstagramIcon></a>
            <a href="#"><YouTubeIcon></YouTubeIcon></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>NHẬN ƯU ĐÃI</h4>
          <p>Nhập email để nhận tin khuyến mãi mới nhất.</p>
          <input type="email" placeholder="Email của bạn" />
          <button>Đăng ký</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Yến Sào Hoàng Gia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
