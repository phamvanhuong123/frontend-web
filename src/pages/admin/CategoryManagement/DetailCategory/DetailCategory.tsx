import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Breadcrumbs,
  Link
} from "@mui/material";
import { categoryApi } from "~/services/axios.category";
import Category from "~/types/category";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function DetailCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryData = await categoryApi.getById(id!);
      setCategory(categoryData);

      if (categoryData.parentCategoryId) {
        const parent = await categoryApi.getById(categoryData.parentCategoryId);
        setParentCategories([parent]); // Mảng chỉ chứa 1 danh mục cha
      }
    } catch (err) {
      console.error("Failed to fetch category details:", err);
      setError("Không thể tải thông tin danh mục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const handleNavigateToSubcategory = (subcategoryId: string) => {
    navigate(`/categories/detail/${subcategoryId}`);
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

  if (!category) {
    return (
      <Box p={4}>
        <Typography>Không tìm thấy danh mục</Typography>
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
          onClick={() => navigate("/admin/categories")}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Danh mục
        </Link>
        {parentCategories.map((parent) => (
          <Link
            key={parent.id}
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/admin/categories/detail/${parent.id}`)}
            sx={{ cursor: 'pointer' }}
          >
            {parent.name}
          </Link>
        ))}
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {category.name}
        </Typography>

        {/* <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Chip 
            label={`${category.productCount} sản phẩm`} 
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={`${category.subCategoryCount} danh mục con`} 
            color="secondary"
            variant="outlined"
          />
          {category.parentCategoryName && (
            <Chip 
              label={`Danh mục cha: ${category.parentCategoryName}`}
              variant="outlined"
            />
          )}
        </Box> */}

        <Typography variant="body1">
          <strong>Mô tả:</strong> {category.description || "Không có mô tả"}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
          >
            Chỉnh sửa
          </Button>
          {/* <Button 
            variant="outlined" 
            color="error"
            onClick={() => navigate(`/admin/categories/delete/${category.id}`)}
          >
            Xóa
          </Button> */}
          <Button 
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Box>
      </Paper>

      {category.subCategories && category.subCategories.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Danh mục con
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {category.subCategories.map((subcategory) => (
              <React.Fragment key={subcategory.id}>
                <ListItem 
                  component="button"
                  onClick={() => handleNavigateToSubcategory(subcategory.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemText
                    primary={subcategory.name}
                    secondary={
                      <>
                        <span>{subcategory.description}</span>
                        <Box component="span" sx={{ display: 'block' }}>
                          <Chip 
                            label={`${subcategory.productCount} sản phẩm`} 
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={`${subcategory.subCategoryCount} danh mục con`} 
                            size="small"
                          />
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default DetailCategory;