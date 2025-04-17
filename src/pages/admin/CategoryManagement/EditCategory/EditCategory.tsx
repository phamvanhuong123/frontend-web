import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import { Flip, toast } from "react-toastify";
import { categoryApi } from "~/services/axios.category";

interface Category {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  productCount: number;
  subCategoryCount: number;
  subCategories?: Category[];
}

function EditCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Omit<Category, 'subCategories'>>({
    id: "",
    name: "",
    description: "",
    parentCategoryId: null,
    parentCategoryName: null,
    productCount: 0,
    subCategoryCount: 0,
  });
  
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryRes = await categoryApi.getById(id!);
        setCategory(categoryRes);   
        const parentsRes = await categoryApi.getAllCategoryParentNames();
        const filteredParents = (parentsRes as Category[]).filter(
          (parent) => parent.id !== id && 
          (!categoryRes.subCategories || 
           !categoryRes.subCategories.some(sub => sub.id === parent.id))
        );
        
        setParentCategories(filteredParents);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu danh mục", {
          autoClose: 1000,
          transition: Flip,
        });
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: name === "parentCategoryId" ? (value || null) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    debugger
    e.preventDefault();
    
    if (!category.name) {
      toast.warning("Vui lòng nhập tên danh mục", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    try {
        const { productCount, subCategoryCount, ...updateData } = category;
        await categoryApi.updateCategory(category.id, updateData);
      
      toast.success("Cập nhật danh mục thành công", {
        autoClose: 1000,
        transition: Flip,
      });
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Cập nhật danh mục thất bại", {
        autoClose: 1000,
        transition: Flip,
      });
    }
  };

  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa danh mục
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <TextField
              fullWidth
              label="Tên danh mục*"
              name="name"
              value={category.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={category.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Danh mục cha"
              name="parentCategoryId"
              value={category.parentCategoryId || ""}
              onChange={handleChange}
              margin="normal"
              disabled={category.subCategoryCount > 0} // Disable if has subcategories
            >
              <MenuItem value="">
                <em>Không có danh mục cha</em>
              </MenuItem>
              {parentCategories.map((parent) => (
                <MenuItem key={parent.id} value={parent.id}>
                  {parent.name}
                </MenuItem>
              ))}
            </TextField>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              Cập nhật danh mục
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditCategory;