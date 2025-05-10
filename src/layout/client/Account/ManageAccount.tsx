import { Modal, Tabs } from "antd";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";
import { useDispatch } from "react-redux";
import { doResetTempAvatarAction } from "~/redux/account/accountSlice";
interface ManageAccountProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const ManageAccount = ({ isModalOpen, setIsModalOpen }: ManageAccountProps) => {
  const dispatch = useDispatch();
  const items = [
    {
      key: "info",
      label: `Cập nhật thông tin`,
      children: <UserInfo />,
    },
    {
      key: "password",
      label: `Đổi mật khẩu`,
      children: <ChangePassword />,
    },
  ];

  return (
    <Modal
      title="Quản lý tài khoản"
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
        dispatch(doResetTempAvatarAction());
      }}
      maskClosable={false}
      width={"60vw"}
    >
      <Tabs defaultActiveKey="info" items={items} />
    </Modal>
  );
};

export default ManageAccount;
