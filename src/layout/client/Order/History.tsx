import { Tag, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

import { FORMAT_DATE_DISPLAY } from "~/utils/constant";
import { useSelector } from "react-redux";
import { orderApi } from "~/services/axios.order";
import "./History.css";
const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const user = useSelector((state: any) => state.account.user);
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await orderApi.callOrderHistory(user.id);
      if (res && res.data) {
        setOrderHistory(res.data);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => <>{index + 1}</>,
    },
    {
      title: "Thời gian ",
      dataIndex: "createdAt",
      render: (item: string) => moment(item).format(FORMAT_DATE_DISPLAY),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      render: (item: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item),
    },
    {
      title: "Trạng thái",
      render: () => <Tag color={"green"}>Thành công</Tag>,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_: any, record: { detail?: object }) => {
        if (!record.detail || typeof record.detail !== "object") {
          return <span>Không có dữ liệu</span>;
        }
        return (
          <pre
            style={{
              maxWidth: 400,
              maxHeight: 200,
              overflow: "auto",
              backgroundColor: "#f6f6f6",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            {JSON.stringify(record.detail, null, 2)}
          </pre>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</h1>
      <Table columns={columns} dataSource={orderHistory} pagination={false} />
    </div>
  );
};

export default History;
