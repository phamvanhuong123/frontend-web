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
import { userApi } from "~/services/axios.user";
import {
  doUploadAvatarAction,
  doUpdateUserInfoAction,
} from "~/redux/account/accountSlice";
import { useEffect, useState } from "react";

const UserInfo: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.account.user);
  const tempAvatar = useSelector((state: any) => state.account.tempAvatar);

  const [isSubmit, setIsSubmit] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Đồng bộ previewAvatar với tempAvatar khi tempAvatar thay đổi
  useEffect(() => {
    if (tempAvatar) {
      // Nếu tempAvatar là một đối tượng File, tạo URL tạm thời
      if (tempAvatar instanceof File) {
        const url = URL.createObjectURL(tempAvatar);
        setPreviewAvatar(url);
        // Cleanup: Giải phóng URL khi component unmount hoặc tempAvatar thay đổi
        return () => URL.revokeObjectURL(url);
      } else {
        // Nếu tempAvatar là chuỗi (URL hoặc base64), sử dụng trực tiếp
        setPreviewAvatar(tempAvatar);
      }
    } else {
      // Reset previewAvatar khi tempAvatar là null
      setPreviewAvatar(null);
    }
  }, [tempAvatar]);

  // Xác định URL để hiển thị avatar
  const urlAvatar = previewAvatar || user?.avatar;
  // (
  //   ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
  //   : null);

  const handleUploadAvatar = async ({ file, onSuccess, onError }: any) => {
    try {
      if (file) {
        // Hiển thị ảnh ngay lập tức sau khi chọn file
        const url = URL.createObjectURL(file);
        setPreviewAvatar(url);

        // Dispatch action để lưu file vào tempAvatar trong Redux
        dispatch(doUploadAvatarAction({ avatar: file }));

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
    beforeUpload: (file: File) => {
      // Kiểm tra loại file trước khi upload
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Bạn chỉ có thể upload file ảnh!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
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
    id: string;
  }) => {
    const { name, phoneNumber } = values;
    setIsSubmit(true);
    try {
      const formData = new FormData();
      formData.append("Id", user?.id);
      formData.append("Email", user?.email);
      formData.append("Name", name);
      formData.append("PhoneNumber", phoneNumber);
      // Nếu tempAvatar tồn tại, gửi file, nếu không gửi avatar hiện tại của user
      formData.append("Avatar", tempAvatar || user?.avatar);

      const res = await userApi.callUpdateUserInfo(formData);
      if (res && res.data) {
        // Update Redux
        dispatch(
          doUpdateUserInfoAction({
            ...user,
            avatar: res.data.avatar,
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
              id: user?.id,
              email: user?.email,
              name: user?.name,
              phoneNumber: user?.phoneNumber,
            }}
          >
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <Form.Item labelCol={{ span: 24 }} label="Email" name="email">
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

            <Button loading={isSubmit} type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UserInfo;
