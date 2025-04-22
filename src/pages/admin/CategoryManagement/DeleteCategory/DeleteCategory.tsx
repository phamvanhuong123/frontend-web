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
import { categoryApi } from "~/services/axios.category";
import { useNavigate } from "react-router-dom";

interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  onDeleteSuccess: () => void;
}

function DeleteCategory({
  open,
  onClose,
  categoryId,
  categoryName,
  onDeleteSuccess,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await categoryApi.deleteCategory(categoryId);
      
      onDeleteSuccess();
      onClose();
      // Optionally navigate to a different page after successful deletion
      // navigate('/categories');
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Xóa danh mục thất bại. Vui lòng thử lại (Bạn phải xóa danh mục con trước).");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-category-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-category-dialog-title">
        Xác nhận xóa danh mục
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DialogContentText>
          Bạn có chắc chắn muốn xóa danh mục <strong>"{categoryName}"</strong>?
        </DialogContentText>
        
        {/* <DialogContentText sx={{ mt: 2 }}>
          <strong>Lưu ý:</strong> Tất cả các danh mục con và sản phẩm thuộc danh mục này sẽ bị xóa.
        </DialogContentText> */}
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

export default DeleteCategory;