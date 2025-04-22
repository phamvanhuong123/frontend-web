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
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postApi } from "~/services/axios.post";
import { Post } from "~/types/post";
import { toast } from "react-toastify";

function PostList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postApi.getAll();
            setPosts(response);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPost) return;

        try {
            await postApi.delete(selectedPost.id);
            toast.success("Xóa bài viết thành công");
            fetchPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("Xóa bài viết thất bại");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedPost(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5">Quản lý bài viết</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/admin/posts/create")}
                >
                    Thêm bài viết
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>URI</TableCell>
                            <TableCell>Thời gian bắt đầu</TableCell>
                            <TableCell>Thời gian kết thúc</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.uri}</TableCell>
                                <TableCell>{post.startTime || "Không xác định"}</TableCell>
                                <TableCell>{post.endTime || "Không xác định"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                                        color={post.isPublished ? "success" : "default"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(post)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa bài viết "{selectedPost?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PostList; 