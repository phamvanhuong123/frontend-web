import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { manufactureApi } from "~/services/axios.manufacture";
import Manufacturer from "~/types/manufacture";
import { useNavigate } from "react-router-dom";

function ListManufacture() {
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchManufacturers = async () => {
        try {
            setLoading(true);
            const response = await manufactureApi.getAll();
            setManufacturers(response);
        } catch (error) {
            console.error("Failed to fetch manufacturers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    if (loading) {
        return <Box sx={{ p: 3, textAlign: 'center' }}>Đang tải danh sách nhà sản xuất...</Box>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="manufacturer table">
                <TableHead>
                    <TableRow>
                        <TableCell>Tên nhà sản xuất</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {manufacturers.map((manufacturer) => (
                        <TableRow key={manufacturer.id}>
                            <TableCell component="th" scope="row">
                                {manufacturer.name}
                            </TableCell>
                            <TableCell>
                                <Tooltip title={manufacturer.description}>
                                    <span>
                                        {manufacturer.description.length > 30
                                            ? `${manufacturer.description.substring(0, 30)}...`
                                            : manufacturer.description}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                {manufacturer.isActive ? 'Active' : 'Inactive'}
                            </TableCell>
                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        "& .MuiIconButton-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                >
                                    <Tooltip title="Xem chi tiết">
                                        <IconButton onClick={() => { navigate(`detail/${manufacturer.id}`); }}>
                                            <VisibilityOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton color="primary" onClick={() => { navigate(`edit/${manufacturer.id}`); }}>
                                            <CreateOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ListManufacture; 