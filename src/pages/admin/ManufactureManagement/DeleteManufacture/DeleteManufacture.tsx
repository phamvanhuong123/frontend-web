import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import { manufactureApi } from "~/services/axios.manufacture";
import { toast } from "react-toastify";

function DeleteManufacture() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        navigate(-1);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await manufactureApi.delete(id!);
            toast.success("Xóa nhà sản xuất thành công");
            navigate("/admin/manufactures");
        } catch (error) {
            console.error("Failed to delete manufacture:", error);
            toast.error("Xóa nhà sản xuất thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title">
                Xác nhận xóa nhà sản xuất
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Bạn có chắc chắn muốn xóa nhà sản xuất này? Hành động này không thể hoàn tác.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Xóa"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteManufacture; 