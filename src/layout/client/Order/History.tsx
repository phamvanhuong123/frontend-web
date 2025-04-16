import { Badge, Descriptions, Divider, Space, Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../../services/axios.order";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import ReactJson from 'react-json-view'

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    useEffect(() => {
        const fetchHistory = async () => {
            const res = await callOrderHistory();
            if (res && res.data) {
                setOrderHistory(res.data);
            }
        }
        fetchHistory();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => (<>{index + 1}</>)
        },
        {
            title: 'Thời gian ',
            dataIndex: 'createdAt',
            render: (item: string, _: any, index: number) => {
                return moment(item).format(FORMAT_DATE_DISPLAY)
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item: number, _: any, index: number) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item)
            }
        },
        {
            title: 'Trạng thái',
            render: () => (

                <Tag color={"green"}>
                    Thành công
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_: any, record: { detail?: object }) => {
                if (!record.detail || typeof record.detail !== 'object') {
                    return <span>Không có dữ liệu</span>;
                }
                return (
                    <ReactJson
                        src={record.detail}
                        name={"Chi tiết đơn mua"}
                        collapsed={true}
                        enableClipboard={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                    />
                );
            },
        },
    ];


    return (
        <div >
            <div style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</div>
            <Table columns={columns} dataSource={orderHistory} pagination={false} />
        </div>
    )
}

export default History;