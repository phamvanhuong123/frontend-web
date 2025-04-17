import React, { useState } from 'react';
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
} from '@mui/material';

function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const totalItems = 4;
    const subtotal = 1029000;
    const total = 1029000;

    const validate = () => {
        const newErrors = {
            name: '',
            phone: '',
            address: '',
        };
        let isValid = true;

        if (formData.name.trim() === '') {
            newErrors.name = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        const trimmedPhone = formData.phone.trim();
        if (trimmedPhone === '') {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
            isValid = false;
        } else if (!/^\d{11}$/.test(trimmedPhone)) {
            newErrors.phone = 'Số điện thoại phải có đúng 11 chữ số';
            isValid = false;
        }

        if (formData.address.trim() === '') {
            newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (validate()) {
            alert('Đơn hàng đã được gửi!');
            // Xử lý submit thật ở đây
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                    Hình thức thanh toán
                </FormLabel>
                <RadioGroup
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <FormControlLabel
                        value="cod"
                        control={<Radio color="primary" />}
                        label="Thanh toán khi nhận hàng"
                    />
                    <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
                    <FormControlLabel value="wallet" control={<Radio />} label="Chuyển khoản thông qua ví điện tử" />
                </RadioGroup>

                <TextField
                    fullWidth
                    label="* Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="* Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="* Địa chỉ nhận hàng"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address}
                    sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tạm tính</Typography>
                    <Typography>{subtotal.toLocaleString()} đ</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Tổng tiền
                    </Typography>
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
