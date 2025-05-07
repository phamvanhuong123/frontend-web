import { useState } from "react";
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
import { couponApi } from "~/services/axios.coupon";

interface DeleteCouponDialogProps {
  open: boolean;
  onClose: () => void;
  couponId: string;
  couponCode: string;
  onDeleteSuccess: () => void;
}

function DeleteCoupon({
  open,
  onClose,
  couponId,
  couponCode,
  onDeleteSuccess,
}: DeleteCouponDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await couponApi.delete(couponId);

      onDeleteSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      setError("Xóa coupon thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-coupon-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-coupon-dialog-title">
        Xác nhận xóa Coupon
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa coupon <strong>"{couponCode}"</strong>?
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          <strong>Lưu ý:</strong> Tất cả dữ liệu liên quan đến coupon này sẽ bị
          xóa.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting} color="inherit">
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

export default DeleteCoupon;
