import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
} from "@mui/material";
import { postApi } from "~/services/axios.post";
import { Post } from "~/types/post";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

export default function PostManagement() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await postApi.getAll();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        navigate("/admin/posts/create");
    };

    const handleView = (id: string) => {
        navigate(`/admin/posts/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/posts/${id}/edit`);
    };

    const handleDelete = (id: string) => {
        navigate(`/admin/posts/${id}/delete`);
    };

    if (loading) {
        return <Typography>Đang tải...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5">Quản lý bài viết</Typography>
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Tạo bài viết mới
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>URI</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.uri}</TableCell>
                                <TableCell>{post.isPublished ? "Đã xuất bản" : "Bản nháp"}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleView(post.id)} color="primary">
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(post.id)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(post.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
} 