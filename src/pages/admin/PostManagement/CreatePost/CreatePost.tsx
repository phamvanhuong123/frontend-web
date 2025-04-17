import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    Paper,
    Typography,
    Grid,
} from "@mui/material";
import { postApi } from "~/services/axios.post";
import { CreatePost } from "~/types/post";
import { toast } from "react-toastify";

function CreatePostForm() {
    const navigate = useNavigate();
    const [post, setPost] = useState<CreatePost>({
        title: "",
        content: "",
        uri: "",
        isPublished: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setPost({
            ...post,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await postApi.create(post);
            toast.success("Tạo bài viết thành công");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("Tạo bài viết thất bại");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Tạo bài viết mới
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
                                Tạo
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

export default CreatePostForm; 