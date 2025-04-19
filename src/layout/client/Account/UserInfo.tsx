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
import {
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../../redux/account/accountSlice";
import { useState } from "react";

const UserInfo: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.account.user);
  const tempAvatar = useSelector((state: any) => state.account.tempAvatar);

  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const [isSubmit, setIsSubmit] = useState(false);

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || user?.avatar}`;

  const handleUploadAvatar = async ({ file, onSuccess, onError }: any) => {
    try {
      const res = await callUpdateAvatar(file);
      if (res && res.data) {
        const newAvatar = res.data.fileUploaded;
        dispatch(doUploadAvatarAction({ avatar: newAvatar }));
        setUserAvatar(newAvatar);
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
    const { name, phoneNumber, _id } = values;
    setIsSubmit(true);
    try {
      const res = await userApi.callUpdateUserInfo(
        user?.id,
        user?.phoneNumber,
        user?.name,
        user?.avatar
      );
      if (res && res.data) {
        // Update Redux
        debugger;
        dispatch(
          doUpdateUserInfoAction({
            avatar: userAvatar,
            phoneNumber,
            name,
            _id: res.data._id,
          })
        );
        // Update localStorage
        // localStorage.setItem("user", JSON.stringify(res.data));
        // Update Redux
        // dispatch(
        //   doUpdateUserInfoAction({ avatar: userAvatar, phoneNumber, name })
        // );
        message.success("Cập nhật thông tin user thành công");

        // Force renew token
        localStorage.removeItem("access_token");
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
          <Form onFinish={onFinish} form={form}>
            <Form.Item hidden name="_id" initialValue={user?.id}>
              <Input hidden />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              initialValue={user?.email}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Tên hiển thị"
              name="name"
              initialValue={user?.name}
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
              initialValue={user?.phoneNumber}
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
              onClick={() => form.submit()}
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
