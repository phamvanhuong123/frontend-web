import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    Paper,
    Typography,
    Grid,
    CircularProgress,
} from "@mui/material";
import { postApi } from "~/services/axios.post";
import { Post } from "~/types/post";
import { toast } from "react-toastify";

function EditPost() {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setPost({
            ...post!,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;

        try {
            await postApi.update(post.id, post);
            toast.success("Cập nhật bài viết thành công");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Failed to update post:", error);
            toast.error("Cập nhật bài viết thất bại");
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
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Chỉnh sửa bài viết
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                name="title"
                                value={post.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="URI"
                                name="uri"
                                value={post.uri}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nội dung"
                                name="content"
                                value={post.content}
                                onChange={handleChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={post.isPublished}
                                        onChange={handleChange}
                                        name="isPublished"
                                    />
                                }
                                label="Xuất bản"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Cập nhật
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/admin/posts")}
                                sx={{ ml: 2 }}
                            >
                                Hủy
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default EditPost; 