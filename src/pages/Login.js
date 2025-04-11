import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Container,
    Grid,
    InputAdornment,
    Avatar
} from '@mui/material';

import { useNavigate } from "react-router-dom";
import { login } from '../api/accountApi';
import { Lock, Person } from '@mui/icons-material';
import backgroundImg from '../img/img1.jpg';  // Import hình ảnh từ thư mục src
const Login = () => {
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        setError('');
        setSuccess('');
        try {
            const result = await login({ tenDangNhap, matKhau });
            setSuccess(result.message);
            localStorage.setItem('user', JSON.stringify(result));
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại");
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                backgroundImage: `url(${backgroundImg})`, // Đường dẫn hình nền
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            {/* Overlay (Lớp mờ trắng) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Màu trắng mờ
                    zIndex: 1,
                }}
            />

            <Container sx={{ position: 'relative', zIndex: 2, width: '550px' }}>
                {/* Login Form */}
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 4 }}>
                    <Grid container justifyContent="center">
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <Person />
                        </Avatar>
                    </Grid>
                    <Typography variant="h5" align="center" sx={{ mt: 2 }} color="primary">
                        Đăng Nhập
                    </Typography>

                    {/* Login Form Fields */}
                    <Box mt={3} display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Tên đăng nhập"
                            value={tenDangNhap}
                            onChange={(e) => setTenDangNhap(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Mật khẩu"
                            type="password"
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLogin}
                            fullWidth
                            size="large"
                            sx={{
                                mt: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 4,
                                padding: '10px 0',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#1c76d1'
                                }
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
