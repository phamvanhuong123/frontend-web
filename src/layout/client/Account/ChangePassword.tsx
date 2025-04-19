import { Button, Col, Form, Input, Row, message, notification } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import {  userApi } from "../../../services/axios.user";

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector((state: any) => state.account.user);

    const onFinish = async (values: { email: string; oldpass: string; newpass: string }) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        try {
            const res = await userApi.callUpdatePassword(email, oldpass, newpass);
            if (res && res.data) {
                message.success("Cập nhật mật khẩu thành công");
                form.setFieldsValue({ oldpass: "", newpass: "" });
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: res?.message || "Không thể cập nhật mật khẩu",
                });
            }
        } catch (error) {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: "Không thể kết nối đến máy chủ",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={12}>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            initialValue={user?.email}
                            rules={[{ required: true, message: "Email không được để trống!" }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;