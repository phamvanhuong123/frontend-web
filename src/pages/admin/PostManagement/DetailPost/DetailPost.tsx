import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { postApi } from "~/services/axios.post";
import { Post } from "~/types/post";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function DetailPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await postApi.getById(id!);
            setPost(response);
        } catch (error) {
            console.error("Failed to fetch post:", error);
            toast.error("Không thể tải thông tin bài viết");
            navigate("/admin/posts");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return null;
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
                    Chi tiết bài viết
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Tiêu đề"
                            secondary={post.title}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="URI"
                            secondary={post.uri}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Nội dung"
                            secondary={post.content}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Thời gian bắt đầu"
                            secondary={post.startTime || "Không xác định"}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Thời gian kết thúc"
                            secondary={post.endTime || "Không xác định"}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Trạng thái"
                            secondary={
                                <Chip
                                    label={post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                                    color={post.isPublished ? "success" : "default"}
                                />
                            }
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => navigate(`/admin/posts/${post.id}/delete`)}
                    >
                        Xóa
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default DetailPost; 