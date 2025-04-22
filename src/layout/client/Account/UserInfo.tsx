import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { callUpdateAvatar, userApi } from "../../../services/axios.user";
import { doUploadAvatarAction, doUpdateUserInfoAction } from "../../../redux/account/accountSlice";
import { useState } from "react";

const UserInfo: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.account.user);
  const tempAvatar = useSelector((state: any) => state.account.tempAvatar);

  const [isSubmit, setIsSubmit] = useState(false);

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    tempAvatar || user?.avatar
  }`;

  const handleUploadAvatar = async ({ file, onSuccess, onError }: any) => {
    try {
      const res = await callUpdateAvatar(file);
      if (res && res.data) {
        const newAvatar = res.data.fileUploaded;
        dispatch(doUploadAvatarAction({ avatar: newAvatar }));
        onSuccess("ok");
        message.success("Upload avatar thành công");
      } else {
        throw new Error("Đã có lỗi khi upload file");
      }
    } catch (error) {
      onError("Đã có lỗi khi upload file");
      message.error("Upload avatar thất bại");
    }
  };

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadAvatar,
    onChange(info: any) {
      if (info.file.status === "done") {
        message.success("Upload file thành công");
      } else if (info.file.status === "error") {
        message.error("Upload file thất bại");
      }
    },
  };

  const onFinish = async (values: {
    name: string;
    phoneNumber: string;
    _id: string;
  }) => {
    const { name, phoneNumber } = values;
    setIsSubmit(true);
    try {
      const res = await userApi.callUpdateUserInfo(
        user?.id,
        phoneNumber,
        name,
        tempAvatar || user?.avatar
      );
      if (res && res.data) {
        // Update Redux
        dispatch(
          doUpdateUserInfoAction({
            ...user,
            avatar: tempAvatar || user?.avatar,
            phoneNumber,
            name,
          })
        );
        
        message.success("Cập nhật thông tin user thành công");
      } else {
        throw new Error(res?.message || "Cập nhật thông tin thất bại");
      }
    } catch (error: any) {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: error.message || "Không thể cập nhật thông tin",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Avatar
                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                icon={<AntDesignOutlined />}
                src={urlAvatar}
                shape="circle"
              />
            </Col>
            <Col span={24}>
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={12}>
          <Form 
            onFinish={onFinish} 
            form={form}
            initialValues={{
              _id: user?.id,
              email: user?.email,
              name: user?.name,
              phoneNumber: user?.phoneNumber
            }}
          >
            <Form.Item hidden name="_id">
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Tên hiển thị"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tên hiển thị không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Button
              loading={isSubmit}
              type="primary"
              htmlType="submit"
            >
              Cập nhật
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UserInfo;