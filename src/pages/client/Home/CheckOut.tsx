import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Divider,
    FormLabel,
    MenuItem,
    Select,
    FormControl
} from '@mui/material';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';
function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        province: ''
    });
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(res => setProvinces(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const validatePhone = (phone: string) => {
        const trimmed = phone.trim();
        return /^0\d{10}$/.test(trimmed); // 11 chữ số, bắt đầu bằng 0
    };

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.province) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!validatePhone(formData.phone)) {
            alert('Số điện thoại không hợp lệ. Vui lòng nhập đủ 11 số và bắt đầu bằng 0.');
            return;
        }

        alert('Đơn hàng đã được gửi!');
    };
    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const totalItems = 4;
    const subtotal = 1029000;
    const total = 1029000;

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>Hình thức thanh toán</FormLabel>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <FormControlLabel value="cod" control={<Radio color="primary" />} label="Thanh toán khi nhận hàng" />
                    <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
                    <FormControlLabel value="e-wallet" control={<Radio />} label="Chuyển khoản qua ví điện tử" />
                </RadioGroup>

                <TextField
                    fullWidth
                    label="* Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="* Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                />
                <p>Địa chỉ giao hàng</p>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <p>Tỉnh/Thành phố</p>
                    <Select
                        name="province"
                        value={formData.province}
                        onChange={handleSelectChange}
                        required
                    >
                        {provinces.map((province: any) => (
                            <MenuItem key={province.code} value={province.name}>
                                {province.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="* Địa chỉ chi tiết"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tạm tính</Typography>
                    <Typography>{subtotal.toLocaleString()} đ</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">Tổng tiền</Typography>
                    <Typography variant="h6" fontWeight="bold" color="error">
                        {total.toLocaleString()} đ
                    </Typography>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                    onClick={handleSubmit}
                >
                    Đặt Hàng ({totalItems})
                </Button>
            </Paper>
        </Box>
    );
}

export default Checkout;
