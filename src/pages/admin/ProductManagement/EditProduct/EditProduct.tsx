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
import { StoreLocation } from "~/types/store";
import storeApi from "~/services/axios.store";
import productStoreApi from "~/services/axios.productStore";

const MAX_IMAGES = 4;

interface ProductFormState {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  manufacturerId: string;
  quantity?: number;
  storeId: string;
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
    quantity: 0,
    storeId: "",
    discountId: null,
    images: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]); 

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
      const storeReponse = await storeApi.getAllStores();
      setLoading(true);
      const [manuResponse, catResponse, productResponse] = await Promise.all([
        manufactureApi.getAll(),
        categoryApi.getAll(), 
        productApi.getById(id), 
      ]);

      setCategories(catResponse);
      setManufacturers(manuResponse);
      setStores(storeReponse);

      if (productResponse) {
        const categoryObj = catResponse.find(cat => cat.name === productResponse.categoryName);
        const manufacturerObj = manuResponse.find(manu => manu.name === productResponse.manufacturerName);     
        //set quantity & name of store
        const stores = await storeApi.getIdOfStore();
        const idx = stores.id;
        const storeDetail = await productStoreApi.getById(id, idx);
        setProduct({
          name: productResponse.name,
          description: productResponse.description || "",
          price: productResponse.price,
          isActive: productResponse.isActive,
          categoryId: categoryObj ? categoryObj.id : "",
          manufacturerId: manufacturerObj ? manufacturerObj.id : "",
          quantity: storeDetail.quantity || 0,
          storeId: storeDetail.id|| "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
  
    const files = Array.from(e.target.files);
    const filesToAdd = files.slice(0, MAX_IMAGES - totalImages); // Chỉ lấy số lượng ảnh còn có thể thêm
  
    if (filesToAdd.length < files.length) {
      toast.warn(`Chỉ có thể thêm ${filesToAdd.length} ảnh. Đã đạt giới hạn tối đa ${MAX_IMAGES} ảnh.`);
    }
  
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
  
    setImageFiles(prev => [...prev, ...filesToAdd]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = ''; // Reset input để có thể chọn lại cùng file nếu cần
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < product.images.length;
    
    if (isExistingImage) {
      // Xóa ảnh đã có từ server
      const newImages = [...product.images];
      newImages.splice(index, 1);
      setProduct(prev => ({ ...prev, images: newImages }));
    } else {
      // Xóa ảnh mới chọn nhưng chưa upload
      const fileIndex = index - product.images.length;
      const newFiles = [...imageFiles];
      newFiles.splice(fileIndex, 1);
      setImageFiles(newFiles);
    }
  
    // Xóa preview tương ứng
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

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
      formData.append("StoreId", product.storeId);
      formData.append("Quantity", product.quantity?.toString() || "0");

      if (product.discountId) {
         formData.append("DiscountId", product.discountId);
      }

      imageFiles.forEach((file, index) => {
        // Backend yêu cầu các key là ImageFile1, ImageFile2, ...
        formData.append(`ImageFile${index + 1}`, file);
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
            <TextField fullWidth label="Số lượng*" name="quantity" type="number" value={product.quantity} onChange={handleChange} required InputProps={{ inputProps: { min: 0 } }} />
            
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

            <FormControl fullWidth required sx={{ mt: 2 }}>
              <InputLabel id="store-label">Cửa hàng phân phối*</InputLabel>
              <Select
                labelId="store-label"
                label="Cửa hàng phân phối*"
                name="storeId"
                value={product.storeId || ""} 
                onChange={handleSelectChange}
                displayEmpty
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
              >
                <MenuItem value="" disabled>

                </MenuItem>
                {stores.map((sto) => (
                  <MenuItem key={sto.id} value={sto.id}>
                    {sto.name}
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
