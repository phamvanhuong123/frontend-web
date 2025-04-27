import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Chip,
  Breadcrumbs,
  Link,
  CardMedia,
  Avatar,
  Divider,
  MenuItem,
  TextField
} from "@mui/material";
import { productApi } from "~/services/axios.product";
import Product, { CreateAProduct, DetailAProduct } from "~/types/product";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getImageUrl } from "~/config/config";

function DetailProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DetailAProduct>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [aCategories, setACategories] = useState<string>();
  const [aManufacturers, setAManufacturers] = useState<string>();

  const fetchProductDetails = async () => {
    try {
      
      setLoading(true);
      setError(null);
      const productData = await productApi.getByIdHaveId(id!);
      setProduct(productData);
      setACategories(productData.categoryName);
      setAManufacturers(productData.manufacturerName);

      if (productData.images && productData.images.length > 0) {
        setMainImage(getImageUrl(productData.images[0].url));
      }
    } catch (err) {
      console.error("Failed to fetch product details:", err);
      setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box p={4}>
        <Typography>Không tìm thấy sản phẩm</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs 
        separator={<KeyboardArrowRightIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/admin/products")}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Sản phẩm
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Layout sử dụng flexbox thay vì Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mb: 4
      }}>
        {/* Phần hình ảnh - chiếm 40% chiều rộng trên desktop */}
        <Box sx={{ 
          width: { xs: '100%', md: '40%' },
          flexShrink: 0
        }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <CardMedia
              component="img"
              image={mainImage || (product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : '')}
              alt={product.name} 
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'contain',
                mb: 2
              }}
            />
            
            {product.images && product.images.length > 1 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {product.images.map((image, index) => (
                  <Avatar
                    key={image.id}
                    src={getImageUrl(image.url)}
                    alt={`${product.name}-${index}`}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      cursor: 'pointer',
                      border: mainImage === getImageUrl(image.url) ? '2px solid #1976d2' : 'none'
                    }}
                    onClick={() => setMainImage(getImageUrl(image.url))}
                    variant="rounded"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Phần thông tin chi tiết - chiếm 60% chiều rộng trên desktop */}
        <Box sx={{ flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip 
                label={product.isActive ? "Đang bán" : "Ngừng bán"} 
                color={product.isActive ? "success" : "error"}
                variant="outlined"
              />
              <Chip 
                label={formatPrice(product.price)} 
                color="primary"
              />
              {product.discountName && (
                <Chip 
                  label={`Khuyến mãi: ${product.discountName}%`}
                  color="secondary"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-line' }}>
              <strong>Mô tả:</strong> {product.description || "Không có mô tả"}
            </Typography>


            <Divider sx={{ my: 2 }} />

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: 2, 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body1">
                  <strong>Danh mục:</strong>{" "}
                  {aCategories || "Không tìm thấy danh mục"}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body1">
                  <strong>Nhà sản xuất:</strong>{" "}
                  {aManufacturers || "Không tìm thấy nhà sản xuất"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
              >
                Chỉnh sửa
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => navigate(`/admin/products/delete/${product.id}`)}
              >
                Xóa
              </Button>
              <Button 
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Phần thông tin bổ sung */}
      {/* <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Thông tin bổ sung
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}> */}
          {/* <Box sx={{ minWidth: 200 }}>
            <Typography variant="body1">
              <strong>Số lượt xem:</strong> {product.viewCount || 0}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            minWidth: 200
          }}>
            <Typography component="span" sx={{ mr: 1 }}>
              <strong>Đánh giá:</strong>
            </Typography> */}
            {/* <Rating 
              value={product.averageRating || 0} 
              precision={0.1} 
              readOnly 
            />
            <Typography component="span" sx={{ ml: 1 }}>
              ({product.reviewCount || 0} đánh giá)
            </Typography> */}
          </Box>
    //     </Box>
    //   </Paper>
    // </Box>
  );
}

export default DetailProduct;