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
} from "@mui/material";
import { manufactureApi } from "~/services/axios.manufacture";
import Manufacturer from "~/types/manufacture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function DetailManufacture() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [manufacture, setManufacture] = useState<Manufacturer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchManufactureDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await manufactureApi.getById(id!);
            setManufacture(response);
        } catch (err) {
            console.error("Failed to fetch manufacture details:", err);
            setError("Không thể tải thông tin nhà sản xuất. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManufactureDetails();
    }, [id]);

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

    if (!manufacture) {
        return (
            <Box p={4}>
                <Typography>Không tìm thấy nhà sản xuất</Typography>
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
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Quay lại
            </Button>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Chi tiết nhà sản xuất
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Tên nhà sản xuất"
                            secondary={manufacture.name}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Mô tả"
                            secondary={manufacture.description}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Trạng thái"
                            secondary={
                                <Chip
                                    label={manufacture.isActive ? "Active" : "Inactive"}
                                    color={manufacture.isActive ? "success" : "error"}
                                    size="small"
                                />
                            }
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`edit/${manufacture.id}`)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => navigate(`delete/${manufacture.id}`)}
                    >
                        Xóa
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default DetailManufacture; 