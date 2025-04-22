import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { userApi } from "~/services/axios.user"; 


interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onDeleteSuccess: () => void;
}

function DeleteUser({
  open,
  onClose,
  userId,
  userName,
  onDeleteSuccess,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await userApi.deleteUser(userId); 
      
      onDeleteSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Xóa người dùng thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-user-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-user-dialog-title">
        Xác nhận xóa người dùng
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DialogContentText>
          Bạn có chắc chắn muốn xóa người dùng <strong>"{userName}"</strong>?
        </DialogContentText>
        
        <DialogContentText sx={{ mt: 2 }}>
          <strong>Lưu ý:</strong> Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
          color="inherit"
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          color="error"
          variant="contained"
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteUser;