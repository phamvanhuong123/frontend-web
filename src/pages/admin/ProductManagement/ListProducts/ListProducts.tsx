import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Box, Chip, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { productApi } from "~/services/axios.product";
import Product from "~/types/product";
import { getImageUrl } from "../../../../config/config";
import DeleteProduct from "../DeleteProduct/DeleteProduct"; // Thêm import này
import { useNavigate } from "react-router-dom";

function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Thêm state cho dialog xóa
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const currentPage = Math.max(0, page);

      const params = {
        pageIndex: currentPage + 1,
        pageSize: rowsPerPage,
      };

      const response = await productApi.getAllPage(params);
      console.log("Products data:", response);

      if (response && response.items) {
        setProducts(response.items);
        setTotalItems(response.totalCount);
      } else {
        setProducts([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel>Tên sản phẩm</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Giá
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Danh mục
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Nhà sản xuất
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Khuyến mãi
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không có sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
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
                  <TableCell align="right">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell align="center">
                    {product.categoryName || "-"}
                  </TableCell>
                  <TableCell align="center">
                    {product.manufacturerName || "-"}
                  </TableCell>
                  <TableCell align="center">
                    {product.discountName || "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {product.images && product.images.length > 0
                        ? product.images.map((image) => {
                        
                            return (
                              <Avatar
                                key={image.id}
                                src={`${getImageUrl(image.url)}`}
                                alt={`${product.name}-${image.id}`}
                                sx={{ width: 56, height: 56 }}
                                variant="rounded"
                              />
                            );
                          })
                        : "-"}
                    </Box>
                  </TableCell>
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
                      <Tooltip
                        title="Xem chi tiết"
                        onClick={() => {
                          navigate(`detail/${product.id}`);
                        }}
                      >
                        <IconButton>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            navigate(`edit/${product.id}`);
                          }}
                        >
                          <CreateOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setProductToDelete({
                              id: product.id,
                              name: product.name,
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />

      {/* Dialog xóa sản phẩm */}
      {productToDelete && (
        <DeleteProduct
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          productId={productToDelete.id}
          productName={productToDelete.name}
          onDeleteSuccess={() => {
            fetchProducts();
          }}
        />
      )}
    </Paper>
  );
}

export default ListProducts;
