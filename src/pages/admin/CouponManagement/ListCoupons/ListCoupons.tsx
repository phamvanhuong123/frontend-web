import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { couponApi } from "~/services/axios.coupon";
import Coupon from "~/types/coupon";
import { useNavigate } from "react-router-dom";
import DeleteCoupon from "../DeleteCoupon/DeleteCoupon";

function ListCoupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<{
    id: string;
    code: string;
  } | null>(null);

  const fetchCoupons = async () => {
    try {
      const response = await couponApi.getAllCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const formatDiscountType = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}%` : `${value}k`;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="coupon table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel>Mã Coupon</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Loại Giảm Giá
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Giá Trị
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Số Lượng
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Trạng Thái
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hành Động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell align="center">
                  {+coupon.discountType == 0 ? "PERCENTAGE" : "FIXED_AMOUNT"}
                </TableCell>
                <TableCell align="center">
                  {formatDiscountType(
                    coupon.discountType == 0 ? "PERCENTAGE" : "FIXED_AMOUNT",
                    coupon.value
                  )}
                </TableCell>
                {/* <TableCell align="center">
                  {coupon.startTime} - {coupon.endTime}
                </TableCell> */}
                <TableCell align="center">{coupon.usageLimit}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={coupon.isActive ? "Active" : "Inactive"}
                    color={coupon.isActive ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      "& .MuiIconButton-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <Tooltip title="View details">
                      <IconButton
                        onClick={() => {
                          navigate(`detail/${coupon.id}`);
                        }}
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          navigate(`edit/${coupon.id}`);
                        }}
                      >
                        <CreateOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setCouponToDelete({
                            id: coupon.id,
                            code: coupon.code,
                          });
                          setDeleteDialogOpen(true);
                        }}
                      >
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

      {couponToDelete && (
        <DeleteCoupon
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          couponId={couponToDelete.id}
          couponCode={couponToDelete.code}
          onDeleteSuccess={() => {
            fetchCoupons();
          }}
        />
      )}
    </>
  );
}

export default ListCoupons;
