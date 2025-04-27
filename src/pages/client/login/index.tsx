import { Button, Divider, Form, Input, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../../redux/account/accountSlice";
import { authApi } from "~/services/axios.auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setIsSubmit(true);
    try {
      const res = await authApi.callLogin(email, password);
      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        
        dispatch(doLoginAction({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          userInfo: res.data.user
        }));
        
        message.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error: any) {
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          error.response?.data?.message || "Email hoặc mật khẩu không đúng",
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Nhập</h2>
              <Divider />
            </div>
            <Form name="login-form" onFinish={onFinish} autoComplete="off">
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Hoặc</Divider>
              <p className="text text-normal">
                Chưa có tài khoản?
                <span>
                  <Link to="/register"> Đăng Ký </Link>
                </span>
              </p>
              <br />
              <p className="text" style={{ color: "#9d9d9d" }}>
                p/s: Để test, sử dụng tài khoản{" "}
                <strong>dinhkhang@gmail.com</strong> / <strong>abc</strong>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
