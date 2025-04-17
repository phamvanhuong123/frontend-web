import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import { Flip, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { categoryApi } from "~/services/axios.category";
import Category from "~/types/category";

function CreateCategory() {
    const [category, setCategory] = useState({
        name: "",
        description: "",
        parentCategoryId: null
    });
    
    const [parentCategories, setParentCategories] = useState<{ id: string | null, name: string | null}[]>([]);
    
    const navigate = useNavigate();

    // Fetch parent categories when component mounts
    useEffect(() => {
        debugger
        const fetchParentCategories = async () => {
            try {
                const parentNames = await categoryApi.getAllCategoryParentNames();
                setParentCategories(parentNames);
            } catch (error) {
                console.log(error);
                toast.error("Không thể tải danh sách danh mục cha", {
                    autoClose: 1000,
                    transition: Flip,
                });
            }
        };
        fetchParentCategories();
    }, []);

    // Sự kiện thay đổi dữ liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
        });
    };

    // Sự kiện submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const fetchApi = async () => {
            try {
                const res = await categoryApi.createCategory(category);
                console.log(res);

                toast.success("Tạo danh mục thành công", {
                    autoClose: 1000,
                    transition: Flip,
                });
                navigate("/admin/categories");
            } catch (error) {
                console.log(error);
                toast.error("Tạo danh mục thất bại", {
                    autoClose: 1000,
                    transition: Flip,
                });
            }
        };
        fetchApi();
    };

    return (
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Tạo mới danh mục
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} direction="column">
                        <TextField
                            fullWidth
                            label="Tên danh mục"
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
                            label="Danh mục cha (nếu có)"
                            name="parentCategoryId"
                            value={category.parentCategoryId || ""}
                            onChange={handleChange}
                            margin="normal"
                        >
                            <MenuItem value="">
                                <em>Không có danh mục cha</em>
                            </MenuItem>
                            {parentCategories.map((parent, index) => (
                                <MenuItem key={parent.id ? parent.id : `${parent.name}-${index}`} value={parent.id || ""}>
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
                            Tạo danh mục
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}

export default CreateCategory;