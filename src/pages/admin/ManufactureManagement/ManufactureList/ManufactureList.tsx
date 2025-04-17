import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { manufactureApi } from "~/services/axios.manufacture";
import Manufacturer from "~/types/manufacture";
import { toast } from "react-toastify";

function ManufactureList() {
    const navigate = useNavigate();
    const [manufactures, setManufactures] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedManufacture, setSelectedManufacture] = useState<Manufacturer | null>(null);

    useEffect(() => {
        fetchManufactures();
    }, []);

    const fetchManufactures = async () => {
        try {
            const response = await manufactureApi.getAll();
            setManufactures(response);
        } catch (error) {
            console.error("Failed to fetch manufactures:", error);
            toast.error("Không thể tải danh sách nhà sản xuất");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (manufacture: Manufacturer) => {
        setSelectedManufacture(manufacture);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedManufacture) return;

        try {
            await manufactureApi.delete(selectedManufacture.id);
            toast.success("Xóa nhà sản xuất thành công");
            fetchManufactures();
        } catch (error) {
            console.error("Failed to delete manufacture:", error);
            toast.error("Xóa nhà sản xuất thất bại");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedManufacture(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5">Quản lý nhà sản xuất</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/admin/manufactures/create")}
                >
                    Thêm nhà sản xuất
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên nhà sản xuất</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {manufactures.map((manufacture) => (
                            <TableRow key={manufacture.id}>
                                <TableCell>{manufacture.name}</TableCell>
                                <TableCell>{manufacture.description}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={manufacture.isActive ? "Active" : "Inactive"}
                                        color={manufacture.isActive ? "success" : "error"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/admin/manufactures/${manufacture.id}`)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => navigate(`/admin/manufactures/${manufacture.id}/edit`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(manufacture)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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

export default ManufactureList; 