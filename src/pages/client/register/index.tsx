import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { authApi } from '~/services/axios.auth';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { name: string; email: string; password: string; phone: string }) => {
        const {email, password, name, phone } = values;
        setIsSubmit(true);
        try {
            
            const res = await authApi.callRegister({ Email: email, Password: password, Name: name, Phone: phone });
            if (res?.data?.user?.id) {
                message.success('Đăng ký tài khoản thành công!'); 
                navigate('/login');
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: Array.isArray(res?.message) ? res.message[0] : res?.message || "Đăng ký thất bại",
                    duration: 5,
                });
            }
        } catch (error) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Không thể kết nối đến máy chủ",
                duration: 5,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="register-form"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Số điện thoại không được để trống!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Hoặc</Divider>
                            <p className="text text-normal">
                                Đã có tài khoản?
                                <span>
                                    <Link to="/login"> Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;