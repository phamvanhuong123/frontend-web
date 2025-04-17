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
} from "@mui/material";
import { postApi } from "~/services/axios.post";
import { toast } from "react-toastify";

function DeletePost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        navigate(-1);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await postApi.delete(id!);
            toast.success("Xóa bài viết thành công");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("Xóa bài viết thất bại");
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
                Xác nhận xóa bài viết
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
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

export default DeletePost; 