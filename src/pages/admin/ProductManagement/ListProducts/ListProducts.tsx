import React, { useEffect, useState } from "react";
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
import { productApi } from "~/services/axios.product";
import Product from "~/types/product";

function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData: Product[] = await productApi.getAll();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000); // Nhân 1000 nếu price tính bằng nghìn VND
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>
              <TableSortLabel>Tên sản phẩm</TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Giá</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Danh mục</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Nhà sản xuất</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Khuyến mãi</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <Tooltip title={product.description}>
                  <span>
                    {product.description.length > 30 
                      ? `${product.description.substring(0, 30)}...` 
                      : product.description}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell align="right">{formatPrice(product.price)}</TableCell>
              <TableCell align="center">{product.categoryName || "-"}</TableCell>
              <TableCell align="center">{product.manufacturerName || "-"}</TableCell>
              <TableCell align="center">{product.discountName || "-"}</TableCell>
              <TableCell align="center">
                <Chip
                  label={product.isActive ? "Đang bán" : "Ngừng bán"}
                  color={product.isActive ? "success" : "error"}
                  variant="outlined"
                  size="small"
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
                  <Tooltip title="Xem chi tiết">
                    <IconButton>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton color="primary">
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

export default ListProducts;