import { useState } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
} from "@mui/material";
import { Flip, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { manufactureApi } from "~/services/axios.manufacture";
import { CreateAManufacture } from "~/types/manufacture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CreateManufacture() {
    const navigate = useNavigate();
    const [manufacture, setManufacture] = useState<CreateAManufacture>({
        name: "",
        phoneNumber: "",
        address: "",
        isActive: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManufacture({
            ...manufacture,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await manufactureApi.create(manufacture);
            toast.success("Thêm nhà sản xuất thành công", {
                autoClose: 1000,
                transition: Flip,
            });
            navigate("/admin/manufactures");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi thêm nhà sản xuất");
        }
    };

    return (
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Thêm nhà sản xuất mới
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <TextField
                            fullWidth
                            label="Tên nhà sản xuất"
                            name="name"
                            value={manufacture.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            name="phoneNumber"
                            value={manufacture.phoneNumber}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Địa chỉ"
                            name="address"
                            value={manufacture.address}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Thêm
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}

export default CreateManufacture; 