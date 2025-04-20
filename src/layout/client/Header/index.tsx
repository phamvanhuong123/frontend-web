import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
  Divider,
  Badge,
  Drawer,
  message,
  Avatar,
  Popover,
  Empty,
  Dropdown,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../../services/axios.auth";
import "./header.scss";
import { doLogoutAction } from "../../../redux/account/accountSlice";
import ManageAccount from "../Account/ManageAccount";

const Header = (props: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector(
    (state: any) => state.account.isAuthenticated
  );
  const user = useSelector((state: any) => state.account.user);
  const carts = useSelector((state: any) => state.order.carts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showManageAccount, setShowManageAccount] = useState(false);

  const handleLogout = async () => {
    await authApi.callLogout();
    dispatch(doLogoutAction());
    message.success("Đăng xuất thành công");
    navigate("/");
  };

  const items = [
    {
      key: "account",
      label: (
        <div onClick={() => setShowManageAccount(true)}>Quản lý tài khoản</div>
      ),
    },
    {
      key: "history",
      label: <Link to="/history">Lịch sử mua hàng</Link>,
    },
    {
      key: "logout",
      label: (
        <div
          onClick={() => {
            handleLogout();
            message.loading("Đang đăng xuất...", 0.5);
          }}
        >
          Đăng xuất
        </div>
      ),
    },
  ];

  const contentPopover = carts?.length > 0 ? (
    <div>
      {carts.map((item: any, index: number) => (
        <div key={index}>{item.name}</div>
      ))}
    </div>
  ) : (
    <Empty description="Không có sản phẩm trong giỏ hàng" />
  );

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div className="page-header__logo">
              <span className="logo">
                <span onClick={() => navigate("/")}>
                  <img
                    src="/logo-new.webp"
                    alt="Logo"
                    style={{ marginRight: 30 }}
                    height={50}
                  />
                </span>
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type="text"
                placeholder="Hôm nay bạn muốn ăn gì?"
                value={props.searchTerm}
                style={{
                  width: "600px",
                  borderRadius: "5px",
                  height: "40px",
                  padding: "0 10px",
                }}
                onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts"
                  title="Sản phẩm mới thêm"
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge count={carts?.length ?? 0} size="small" showZero>
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}>Đăng nhập</span>
                ) : (
                  <Dropdown
                    key={isAuthenticated}
                    menu={{ items }}
                    trigger={["click"]}
                  >
                    <Space>
                      <Avatar src={user?.avatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p onClick={() => setShowManageAccount(true)}>Quản lý tài khoản</p>
        <Divider />
        <p onClick={handleLogout}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <ManageAccount
        isModalOpen={showManageAccount}
        setIsModalOpen={setShowManageAccount}
      />
    </>
  );
};

export default Header;
