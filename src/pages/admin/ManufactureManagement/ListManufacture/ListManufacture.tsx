import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Button, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { manufactureApi } from "~/services/axios.manufacture";
import Manufacturer from "~/types/manufacture";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ListManufacture() {
    const navigate = useNavigate();
    const [manufactures, setManufactures] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedManufacture, setSelectedManufacture] = useState<Manufacturer | null>(null);

    const fetchManufacturers = async () => {
        try {
            setLoading(true);
            const response = await manufactureApi.getAll();
            setManufactures(response);
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

    const handleDeleteClick = (manufacture: Manufacturer) => {
        setSelectedManufacture(manufacture);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedManufacture) return;

        try {
            await manufactureApi.delete(selectedManufacture.id);
            toast.success("Xóa nhà sản xuất thành công");
            fetchManufacturers();
        } catch (error) {
            console.error("Failed to delete manufacture:", error);
            toast.error("Xóa nhà sản xuất thất bại");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedManufacture(null);
        }
    };
    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="manufacturer table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên nhà sản xuất</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {manufactures.map((manufacturer) => (
                            <TableRow key={manufacturer.id}>
                                <TableCell component="th" scope="row">
                                    {manufacturer.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {manufacturer.phoneNumber}
                                </TableCell>

                                <TableCell>
                                    {manufacturer.address}
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
                                            <IconButton color="error" onClick={() => handleDeleteClick(manufacturer)}>
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
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa nhà sản xuất "{selectedManufacture?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ListManufacture; 