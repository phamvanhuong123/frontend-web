import React, { useEffect, useState } from 'react';
import {
    Box, Paper, TextField, Typography, RadioGroup,
    FormControlLabel, Radio, Button, Divider,
    FormLabel, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';

function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address: ''
    });

    const totalItems = 4;
    const subtotal = 1029000;
    const total = 1029000;

    // Load provinces on mount
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1')
            .then(res => setProvinces(res.data))
            .catch(err => console.error(err));
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (formData.province) {
            const selected = provinces.find(p => p.name === formData.province);
            if (selected) {
                axios.get(`https://provinces.open-api.vn/api/p/${selected.code}?depth=2`)
                    .then(res => setDistricts(res.data.districts))
                    .catch(err => console.error(err));
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [formData.province]);

    // Load wards when district changes
    useEffect(() => {
        if (formData.district) {
            const selected = districts.find(d => d.name === formData.district);
            if (selected) {
                axios.get(`https://provinces.open-api.vn/api/d/${selected.code}?depth=2`)
                    .then(res => setWards(res.data.wards))
                    .catch(err => console.error(err));
            }
        } else {
            setWards([]);
        }
    }, [formData.district]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'province' && { district: '', ward: '' }),
            ...(name === 'district' && { ward: '' })
        }));
    };

    const handleSubmit = () => {
        alert('Đơn hàng đã được gửi!');
    };

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

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>* Tỉnh/Thành phố</InputLabel>
                    <Select
                        name="province"
                        value={formData.province}
                        label="* Tỉnh/Thành phố"
                        onChange={handleChange}
                        required
                    >
                        {provinces.map((p) => (
                            <MenuItem key={p.code} value={p.name}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} disabled={!districts.length}>
                    <InputLabel>* Quận/Huyện</InputLabel>
                    <Select
                        name="district"
                        value={formData.district}
                        label="* Quận/Huyện"
                        onChange={handleChange}
                        required
                    >
                        {districts.map((d) => (
                            <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} disabled={!wards.length}>
                    <InputLabel>* Phường/Xã</InputLabel>
                    <Select
                        name="ward"
                        value={formData.ward}
                        label="* Phường/Xã"
                        onChange={handleChange}
                        required
                    >
                        {wards.map((w) => (
                            <MenuItem key={w.code} value={w.name}>{w.name}</MenuItem>
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
