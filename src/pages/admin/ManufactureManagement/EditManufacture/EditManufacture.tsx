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
        phoneNumber: "",
        address: ""
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
        const { name, value } = e.target;
        setManufacture({
            ...manufacture,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await manufactureApi.update(id!, manufacture);
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
                            label="Số điện thoại"
                            name="phoneNumber"
                            value={manufacture.phoneNumber}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Địa chỉ"
                            name="address"
                            value={manufacture.address}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            required
                            margin="normal"
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