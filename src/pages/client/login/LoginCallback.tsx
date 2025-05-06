import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Spin, Alert } from 'antd';
import { authApi } from '~/services/axios.auth';
import { doLoginAction } from '~/redux/account/accountSlice';

const LoginCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const errorMessage = params.get('error');

        if (code) {
            // Xử lý callback từ Google
            authApi.callGoogleCallback(code)
                .then(res => {
                    if (res?.data) {
                        // Lưu token vào localStorage
                        localStorage.setItem('access_token', res.data.accessToken);

                        // Lưu thông tin người dùng
                        if (res.data.user) {
                            localStorage.setItem('user_info', JSON.stringify(res.data.user));
                        }

                        // Cập nhật Redux store
                        dispatch(doLoginAction({
                            accessToken: res.data.accessToken,
                            userInfo: res.data.user
                        }));

                        // Chuyển hướng đến trang chủ
                        navigate('/');
                    }
                })
                .catch(err => {
                    console.error('Google callback error:', err);
                    setError(err.response?.data?.message || 'Đăng nhập với Google thất bại');
                    setTimeout(() => navigate('/login', { state: { error: err.message } }), 3000);
                });
        } else if (errorMessage) {
            // Xử lý lỗi từ quá trình xác thực
            setError(errorMessage);
            setTimeout(() => navigate('/login', { state: { error: errorMessage } }), 3000);
        } else {
            // Không có code hoặc error, chuyển hướng về trang đăng nhập
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert
                    message="Lỗi xác thực"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '20px' }}>Đang xử lý đăng nhập...</h2>
            <Spin size="large" />
        </div>
    );
};

export default LoginCallback; 