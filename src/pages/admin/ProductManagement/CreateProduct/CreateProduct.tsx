import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import { Flip, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { productApi } from "~/services/axios.product";
import { CreateAProduct } from "~/types/product";
import Category from "~/types/category";
import Manufacturer from "~/types/manufacture";
import { manufactureApi } from "~/services/axios.manufacture";
import { categoryApi } from "~/services/axios.category";
import DeleteIcon from '@mui/icons-material/Delete';
import storeApi from "~/services/axios.store";
import { StoreLocation } from "~/types/store";

function CreateProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [product, setProduct] = useState<CreateAProduct>({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    categoryId: "",
    manufacturerId: "",
    discountId: "",
    quantity: 0,
    storeId: "",
    images: []
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4); // Giới hạn tối đa 4 ảnh
      setImageFiles(files);

      // Tạo preview cho các ảnh
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);

      setProduct(prev => ({
        ...prev,
        imageFiles: files
      }));
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);

    setProduct(prev => ({
      ...prev,
      imageFiles: newFiles
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh");
      return;
    }

    const fetchApi = async () => {
      try {
        debugger
        const formData = new FormData();

        formData.append("Name", product.name);
        formData.append("Description", product.description || "");
        formData.append("Price", product.price.toString());
        formData.append("IsActive", "true");
        formData.append("CategoryId", product.categoryId);
        formData.append("ManufacturerId", product.manufacturerId);
        formData.append("Quantity", product.quantity.toString());
        formData.append("StoreId", product.storeId || "");

        if (product.discountId) {
          formData.append("DiscountId", product.discountId);
        }

        // Thêm các file ảnh vào FormData
        imageFiles.forEach((file, index) => {
          formData.append(`ImageFile${index + 1}`, file);
        });

        const res = await productApi.CreateProduct(formData);
        console.log("Response from server:", res);

        toast.success("Thêm sản phẩm thành công", {
          autoClose: 1000,
          transition: Flip,
        });

        navigate("/admin/products");
      } catch (error: any) {
        console.error("Error details:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm");
      }
    };
    fetchApi();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manuResponse = await manufactureApi.getAll();
        const catResponse = await categoryApi.getAll();
        const storeResponse = await storeApi.getAllStores();

        setCategories(catResponse);
        setManufacturers(manuResponse);
        setStores(storeResponse);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2,overflow : 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Thêm sản phẩm mới
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} gap={2}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={product.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Giá"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="Số lượng"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              select
              fullWidth
              label="Danh mục"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Nhà Sản xuất"
              name="manufacturerId"
              value={product.manufacturerId}
              onChange={handleChange}
              required
            >
              {manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Cửa hàng phân phối"
              name="storeId"
              value={product.storeId}
              onChange={handleChange}
              required
            >
              {stores.map((storeName) => (
                <MenuItem key={storeName.id} value={storeName.id}>
                  {storeName.name}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mt: 2, display : 'flex',gap  : 2 ,alignItems : 'start' }}>
              
              <Box>
              <Typography variant="subtitle1" gutterBottom>
                Hình ảnh sản phẩm (Tối đa 4 ảnh)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={imageFiles.length >= 4}
                >
                  Chọn ảnh
                </Button>
              </label>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {product.images?.map((image) => (
                  <Box key={image.id} sx={{ position: 'relative' }}>
                    <img
                      src={image.url}
                      alt={`product-image-${image.id}`}
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                ))}
              </Box>
              </Box>
              <Button type="submit" variant="contained" color="primary">
                Thêm sản phẩm
              </Button>
            </Box>
            
           
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateProduct;