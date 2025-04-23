import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Box,
  IconButton,
  CircularProgress,
  Switch,
} from "@mui/material";
import { Flip, toast } from "react-toastify";
import { productApi } from "~/services/axios.product";
import { categoryApi } from "~/services/axios.category";
import { manufactureApi } from "~/services/axios.manufacture";
import Category from "~/types/category";
import Manufacturer from "~/types/manufacture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from '@mui/icons-material/Delete';
import { getImageUrl } from "~/config/config";

const MAX_IMAGES = 4;

interface ProductFormState {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  manufacturerId: string;
  discountId: string | null;
  images: { id?: string; url: string; isMain?: boolean }[];
}

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductFormState>({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    categoryId: "",
    manufacturerId: "",
    discountId: null,
    images: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const totalImages = useMemo(() => {
    return product.images.length + imageFiles.length;
  }, [product.images.length, imageFiles.length]);

  const canAddMoreImages = useMemo(() => {
    return totalImages < MAX_IMAGES;
  }, [totalImages]);

  const fetchInitialData = useCallback(async () => {
    if (!id) {
      toast.error("Product ID is missing.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [manuResponse, catResponse, productResponse] = await Promise.all([
        manufactureApi.getAll(),
        categoryApi.getAll(),
        productApi.getById(id),
      ]);

      setCategories(catResponse);
      setManufacturers(manuResponse);

      if (productResponse) {
        const categoryObj = catResponse.find(cat => cat.name === productResponse.categoryName);
        const manufacturerObj = manuResponse.find(manu => manu.name === productResponse.manufacturerName);

        setProduct({
          name: productResponse.name,
          description: productResponse.description || "",
          price: productResponse.price,
          isActive: productResponse.isActive,
          categoryId: categoryObj ? categoryObj.id : "",
          manufacturerId: manufacturerObj ? manufacturerObj.id : "",
          discountId: productResponse.discountName || null,
          images: productResponse.images || [], 
        });

        if (productResponse.images?.length) {
          const previews = productResponse.images.map(img => getImageUrl(img.url));
          setImagePreviews(previews);
        } else {
          setImagePreviews([]);
        }
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu sản phẩm", {
        autoClose: 1000,
        transition: Flip,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const filesToAdd = files.slice(0, MAX_IMAGES - totalImages); 

    if (filesToAdd.length < files.length) {
        toast.warn(`Chỉ thêm được ${filesToAdd.length} ảnh. Đã đạt số lượng ảnh tối đa (${MAX_IMAGES} ảnh).`);
    } else if (filesToAdd.length === 0 && files.length > 0) {
         toast.warn(`Đã đạt số lượng ảnh tối đa (${MAX_IMAGES} ảnh).`);
         return;
    }

    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...filesToAdd]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  }, [canAddMoreImages, totalImages]);

  const removeImage = useCallback((index: number) => {
    const existingImagesCount = product.images.length;
    const isExistingImage = index < existingImagesCount;

    URL.revokeObjectURL(imagePreviews[index]);

    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (isExistingImage) {
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      const fileIndex = index - existingImagesCount;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  }, [product.images, imageFiles, imagePreviews]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalImages === 0) {
      toast.error("Vui lòng thêm ít nhất một hình ảnh cho sản phẩm.");
      return;
    }

    if (!product.name || !product.price || !product.categoryId || !product.manufacturerId || !product.isActive) {
         toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
         return;
    }

    try {
      const formData = new FormData();
      formData.append("Name", product.name);
      formData.append("Description", product.description || "");
      formData.append("Price", product.price.toString());
      formData.append("IsActive", product.isActive.toString());
      formData.append("CategoryId", product.categoryId);
      formData.append("ManufacturerId", product.manufacturerId);

      if (product.discountId) {
         formData.append("DiscountId", product.discountId);
      }
      product.images.forEach(image => {
        formData.append("ExistingImageUrls", image.url);
      });

      imageFiles.forEach(file => {
        formData.append("NewImageFiles", file); 
      });

      if (!id) {
        toast.error("Không tìm thấy ID sản phẩm");
        return;
      }

      await productApi.updateProduct(id, formData);

      toast.success("Cập nhật sản phẩm thành công", {
        autoClose: 1000,
        transition: Flip,
      });

      navigate("/admin/products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{width : 600, maxWidth: '100%', margin: "auto", mt: 4, p: 2,overflow : 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa sản phẩm
        </Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Quay lại
        </Button>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField fullWidth label="Tên sản phẩm*" name="name" value={product.name} onChange={handleChange} required />
            <TextField fullWidth label="Mô tả" name="description" value={product.description} onChange={handleChange} multiline rows={4} />
            <TextField fullWidth label="Giá*" name="price" type="number" value={product.price} onChange={handleChange} required InputProps={{ inputProps: { min: 0 } }} />
            <FormControlLabel control={<Switch checked={product.isActive} onChange={handleSwitchChange} name="isActive" color="primary" />} label={product.isActive ? "Đang bán" : "Ngừng bán"} />
            <FormControl fullWidth required>
              <InputLabel id="category-label">Danh mục*</InputLabel>
              <Select labelId="category-label" label="Danh mục*" name="categoryId" value={product.categoryId} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Chọn danh mục</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="manufacturer-label">Nhà sản xuất*</InputLabel>
              <Select labelId="manufacturer-label" label="Nhà sản xuất*" name="manufacturerId" value={product.manufacturerId} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Chọn nhà sản xuất</MenuItem>
                {manufacturers.map(manufacturer => (
                  <MenuItem key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Hình ảnh sản phẩm (Tối đa {MAX_IMAGES} ảnh)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img src={preview} alt={`preview-${index}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton size="small" onClick={() => removeImage(index)} sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <input type="file" accept="image/*" onChange={handleFileChange} multiple style={{ display: 'none' }} id="image-upload" disabled={!canAddMoreImages} />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span" disabled={!canAddMoreImages} sx={{ mt: 2 }}>
                  Thêm ảnh
                </Button>
              </label>
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Cập nhật sản phẩm
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditProduct;
