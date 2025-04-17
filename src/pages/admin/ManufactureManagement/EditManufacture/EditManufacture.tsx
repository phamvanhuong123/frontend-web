import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { Flip, toast } from "react-toastify";
import { manufactureApi } from "~/services/axios.manufacture";
import Manufacturer from "~/types/manufacture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function EditManufacture() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [manufacture, setManufacture] = useState<Manufacturer>({
        id: "",
        name: "",
        description: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await manufactureApi.getById(id!);
                setManufacture(response);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu nhà sản xuất", {
                    autoClose: 1000,
                    transition: Flip,
                });
                navigate("/admin/manufactures");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setManufacture({
            ...manufacture,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await manufactureApi.update(manufacture);
            toast.success("Cập nhật nhà sản xuất thành công", {
                autoClose: 1000,
                transition: Flip,
            });
            navigate("/admin/manufactures");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật nhà sản xuất");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card sx={{ maxWidth: 800, ml: 10, mt: 4, p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Chỉnh sửa nhà sản xuất
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} direction="column">
                        <TextField
                            fullWidth
                            label="Tên nhà sản xuất*"
                            name="name"
                            value={manufacture.name}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            value={manufacture.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={manufacture.isActive}
                                    onChange={handleChange}
                                    name="isActive"
                                />
                            }
                            label="Active"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Cập nhật nhà sản xuất
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}

export default EditManufacture; 