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
import { productApi } from "~/services/axios.product";
import { useNavigate } from "react-router-dom";

interface DeleteProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onDeleteSuccess: () => void;
}

function DeleteProduct({
  open,
  onClose,
  productId,
  productName,
  onDeleteSuccess,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await productApi.deleteProduct(productId);
      
      onDeleteSuccess();
      onClose();
      // Có thể điều hướng đến trang khác sau khi xóa thành công
      // navigate('/products');
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-product-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-product-dialog-title">
        Xác nhận xóa sản phẩm
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DialogContentText>
          Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productName}"</strong>?
        </DialogContentText>
        
        <DialogContentText sx={{ mt: 2 }}>
          <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
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

export default DeleteProduct;