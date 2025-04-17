import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import ChatIcon from '@mui/icons-material/Chat';
import './Footer.css';

function Footer() {
    return (
        <Box component="footer" className="footer">
            <Box className="footer-container" sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box className="footer-column">
                            <h3>Về Chúng Tôi</h3>
                            <ul>
                                <li>Giới thiệu</li>
                                <li>Điều khoản dịch vụ</li>
                                <li>Chính sách bảo mật</li>
                            </ul>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box className="footer-column">
                            <h3>Hỗ Trợ</h3>
                            <ul>
                                <li>Trung tâm trợ giúp</li>
                                <li>Hướng dẫn mua hàng</li>
                                <li>Chính sách đổi trả</li>
                            </ul>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box className="footer-column">
                            <h3>Liên Hệ</h3>
                            <ul>
                                <li>Email: support@example.com</li>
                                <li>Hotline: 1900 1000</li>
                            </ul>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box className="footer-column">
                            <h3>Theo Dõi Chúng Tôi</h3>
                            <ul>
                                <li><FacebookIcon /> Facebook</li>
                                <li><ChatIcon />Zalo</li>
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="footer-bottom" sx={{ textAlign: 'center', mt: 4, fontSize: '14px' }}>
                © 2025 - Bản quyền thuộc về Nhóm
            </Box>
        </Box>
    );
}

export default Footer;
