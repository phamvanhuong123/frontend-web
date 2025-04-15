import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Rating,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const mockProduct = {
  name: 'Yến Sào Tinh Chế Cao Cấp 100g',
  image: 'https://bizweb.dktcdn.net/100/328/721/products/z3196478259165-54fd21b105e1363ad0e92291516f11da.jpg?v=1645372657657',
  description: 'Yến sào nguyên chất loại 100g, phù hợp bồi bổ sức khoẻ, tăng đề kháng.',
  price: 2400000,
  sold: 31,
  rating: 4.5,
  shipping: 'Miễn phí vận chuyển toàn quốc',
};

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  const handleChangeQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <Box p={4}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Ảnh sản phẩm */}
        <Grid item xs={12} md={5}>
          <Box>
            <img
              src={mockProduct.image}
              alt={mockProduct.name}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                objectFit: 'cover',
                maxHeight: 400,
              }}
            />
            <Box mt={2}>
              <img
                src={mockProduct.image}
                width={60}
                height={80}
                alt="thumb"
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight={600}>
            {mockProduct.name}
          </Typography>

          <Box mt={1} display="flex" alignItems="center">
            <Rating value={mockProduct.rating} precision={0.5} readOnly />
            <Typography ml={2}>Đã bán {mockProduct.sold}</Typography>
          </Box>

          <Typography variant="h4" color="error" mt={2}>
            {mockProduct.price.toLocaleString()} ₫
          </Typography>

          <Typography mt={1} fontStyle="italic">
            Vận chuyển: {mockProduct.shipping}
          </Typography>

          <Typography mt={2} color="text.secondary">
            {mockProduct.description}
          </Typography>

          <Box mt={3} display="flex" alignItems="center">
            <Typography mr={2}>Số lượng:</Typography>
            <IconButton onClick={() => handleChangeQuantity(-1)}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
              style={{ width: 50 }}
            />
            <IconButton onClick={() => handleChangeQuantity(1)}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="outlined" color="error" size="large">
              🛒 Thêm vào giỏ hàng
            </Button>
            <Button variant="contained" color="error" size="large">
              Mua ngay
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
