import { useState, useEffect } from "react";
import {
    Container, FormControl, InputLabel, MenuItem, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, FormControlLabel, Checkbox, TextField
} from "@mui/material";
import { fetchDepartment, fetchAcademicYears, exportDetails, exportSummary } from "../api/standardHourApi"; // Thay thế bằng API thực tế
import dayjs from "dayjs";

import { toast } from 'react-toastify';

export default function QuanLyGioGiang() {
    const [khoaList, setKhoaList] = useState([]);
    const [selectedKhoa, setSelectedKhoa] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [giangVienList, setGiangVienList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState([]);
    const [printType, setPrintType] = useState("");

    // Dialog chọn tháng
    const [openMonthDialog, setOpenMonthDialog] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState([]);

    const [yearList, setYearList] = useState([]);


    const [searchKeyword, setSearchKeyword] = useState('');


    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDepartment();
                console.log(data);
                setKhoaList(data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedKhoa && selectedYear) {
            const khoa = khoaList.find(k => k.maKhoa === selectedKhoa);
            if (!khoa) return;

            const updatedGiangVienList = khoa.giangViens.map(gv => {
                // Tìm số tiết theo năm đã chọn
                const selectedYearData = gv.soTietTheoNam?.find(item => item.nam === parseInt(selectedYear)) || {
                    soTietDaDay: 0,
                    soTietHoatDong: 0
                };

                return {
                    ...gv,
                    soTietDay: selectedYearData.soTietDaDay,
                    soTietKhac: selectedYearData.soTietHoatDong
                };
            });

            setGiangVienList(updatedGiangVienList);
        }
    }, [selectedKhoa, selectedYear, khoaList]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAcademicYears();
                console.log(data);
                setYearList(data);

                if (data.length > 0) {
                    setSelectedYear(Math.max(...data)); // Lấy năm mới nhất
                }


            } catch (error) {
                console.error("Lỗi tải danh sách năm học:", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (!khoaList || khoaList.length === 0) {
            console.log("Danh sách khoa trống!");
            return;
        }

        let danhSachGiangVien = [];

        if (!selectedKhoa) {
            // Nếu không chọn đơn vị, lấy tất cả giảng viên từ mọi đơn vị
            danhSachGiangVien = khoaList.flatMap(khoa => khoa.giangViens || []);
            console.log("Tất cả giảng viên:", danhSachGiangVien);
        } else {
            // Nếu chọn đơn vị, chỉ lấy giảng viên của đơn vị đó
            const khoa = khoaList.find(k => k.maDonVi === selectedKhoa);
            if (khoa) danhSachGiangVien = khoa.giangViens || [];
        }

        const updatedGiangVienList = danhSachGiangVien.map(gv => {
            const selectedYearData = gv.soTietTheoNam?.find(item => item.nam === parseInt(selectedYear)) || {
                soTietDaDay: 0,
                soTietHoatDong: 0
            };

            return {
                ...gv,
                soTietDay: selectedYearData.soTietDaDay,
                soTietKhac: selectedYearData.soTietHoatDong
            };
        });

        console.log("Giảng viên cập nhật:", updatedGiangVienList);
        // setGiangVienList(updatedGiangVienList);
        setGiangVienList([...updatedGiangVienList]);

    }, [selectedKhoa, selectedYear, khoaList]);



    // Lọc danh sách giảng viên theo từ khóa tìm kiếm
    // const filteredGiangVienList = giangVienList.filter(gv =>
    //     gv.maGv.toString().toLowerCase().includes(searchKeyword.toLowerCase()) ||
    //     gv.tenGv.toLowerCase().includes(searchKeyword.toLowerCase())
    // );
    const filteredGiangVienList = giangVienList
        .filter(gv =>
            gv.maGv.toString().toLowerCase().includes(searchKeyword.toLowerCase()) ||
            gv.tenGv.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .sort((a, b) => a.maGv.toString().localeCompare(b.maGv, undefined, { numeric: true }));


    const handleOpenDialog = (title, giangVien) => {
        setDialogTitle(title);
        setDialogContent(giangVien?.lichDay || []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Mở Dialog chọn tháng
    const handleOpenMonthDialog = (type) => {
        setOpenMonthDialog(true);
        setPrintType(type);
    };

    const handleCloseMonthDialog = () => {
        setOpenMonthDialog(false);
    };

    const handleToggleMonth = (month) => {
        setSelectedMonths((prev) =>
            prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
        );
    };

    const handleExport = async () => {

        if (selectedMonths.length === 0) {
            // alert("Vui lòng chọn ít nhất một tháng!");
            toast.warning("Vui lòng chọn ít nhất một tháng!");
            return;
        }
        if (printType === "ct") {
            try {
                await exportDetails(selectedYear, selectedMonths);
                // alert(response.message);
            } catch (error) {
                if (error.message) {
                    toast.error(error.message);
                } else {
                    toast.error("Lỗi khi xuất chi tiết lịch học!");
                }
            } finally {
                setOpenMonthDialog(false);
                setSelectedMonths([]);
            }
        }

        else if (printType === "tk") {
            try {
                await exportSummary(selectedYear, selectedMonths);
                // alert(response.message);
            } catch (error) {
                if (error.message) {
                    toast.error(error.message);
                } else {
                    toast.error("Lỗi khi xuất thống kê giờ giảng!");
                }
            } finally {
                setOpenMonthDialog(false);
                setSelectedMonths([]);
            }
        }

    };

    return (
        <Container sx={{ mt: 4 }}>
            {/* <Typography variant="h4" gutterBottom>Quản Lý Giờ Chuẩn</Typography> */}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Quản Lý Giờ Chuẩn
                </Typography>

                {selectedYear && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button variant="contained" color="secondary" onClick={() => handleOpenMonthDialog("tk")}>
                            In Thống Kê Giờ Giảng
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => handleOpenMonthDialog("ct")}>
                            In Chi Tiết Lịch Dạy
                        </Button>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, width: "80%" }}>

                {/* Ô tìm kiếm giảng viên */}
                <TextField
                    fullWidth
                    label="Tìm kiếm giảng viên"
                    variant="outlined"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {/* Chọn đơn vị */}
                <FormControl fullWidth>
                    <InputLabel sx={{ background: "white" }}>Đơn Vị</InputLabel>
                    <Select
                        value={selectedKhoa}
                        onChange={(e) => setSelectedKhoa(e.target.value)}
                    // displayEmpty
                    >
                        <MenuItem value="">Tất cả đơn vị</MenuItem>
                        {khoaList.map((donVi) => (
                            <MenuItem key={donVi.maDonVi} value={donVi.maDonVi}>
                                {donVi.tenDonVi}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth >
                    <InputLabel sx={{ background: "white" }}>Năm học</InputLabel>
                    <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {/* {[2023, 2024, 2025].map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))} */}
                        {yearList.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* {selectedKhoa && selectedYear && ( */}
            <>
                <TableContainer component={Paper} sx={{ mt: 2 }} fullWidth>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Mã Giảng Viên</TableCell>
                                <TableCell align="center">Tên Giảng Viên</TableCell>
                                <TableCell align="center">Giờ Dạy</TableCell>
                                <TableCell align="center">Giờ Khác</TableCell>
                                <TableCell align="center">Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGiangVienList.map((gv) => {
                                // Lọc số tiết theo năm được chọn
                                const soTietNam = gv.soTietTheoNam.find(item => item.nam === selectedYear);

                                return (
                                    <TableRow key={gv.maGv}>
                                        <TableCell align="center">{gv.maGv}</TableCell>
                                        <TableCell align="center">{gv.tenGv}</TableCell>
                                        <TableCell align="center">{soTietNam ? soTietNam.soTietDaDay : 0}</TableCell>
                                        <TableCell align="center">{soTietNam ? soTietNam.soTietHoatDong : 0}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenDialog(`Chi tiết lịch dạy của ${gv.tenGv} năm ${selectedYear}`, gv)}
                                            >
                                                Xem Chi Tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>

                    </Table>
                </TableContainer>
            </>
            {/* )} */}

            {/* Dialog Chi Tiết */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent sx={{ minHeight: "60vh" }}>
                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Ngày</TableCell>
                                    <TableCell align="center">Buổi</TableCell>
                                    <TableCell align="center">Lớp</TableCell>
                                    <TableCell align="center">Diễn giải</TableCell>
                                    <TableCell align="center">Số Tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dialogContent
                                    .filter(row => new Date(row.ngayHoc).getFullYear() === parseInt(selectedYear))
                                    .map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">
                                                {dayjs(row.ngayHoc).format("DD/MM/YYYY")}
                                            </TableCell>
                                            <TableCell align="center">{row.buoiHoc}</TableCell>
                                            <TableCell align="center">{row.tenLop}</TableCell>
                                            {/* <TableCell align="center">{row.tenPhan} - {row.tenBai}</TableCell> */}
                                            <TableCell align="center">
                                                {row.tenPhan && row.tenBai ? `${row.tenPhan} - ${row.tenBai}` : row.hoatDong}
                                            </TableCell>
                                            <TableCell align="center">{row.soTietPhanBo}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Chọn Tháng */}
            <Dialog
                open={openMonthDialog}
                onClose={handleCloseMonthDialog}
                sx={{ "& .MuiDialog-paper": { borderRadius: 3, boxShadow: 5, p: 2 } }}
                maxWidth="md" // Tăng kích thước tối đa
                fullWidth // Cho phép dialog mở rộng full width theo maxWidth
            >
                <DialogTitle sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    // bgcolor: "#f0f0f0",
                    borderRadius: "8px 8px 0 0"
                }}>
                    Chọn Tháng In
                </DialogTitle>

                <DialogContent>
                    {/* Nút chọn tất cả */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => setSelectedMonths(selectedMonths.length === 12 ? [] : Array.from({ length: 12 }, (_, i) => i + 1))}
                        >
                            {selectedMonths.length === 12 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </Button>
                    </Box>

                    {/* Lưới 4 cột cho tháng */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <FormControlLabel
                                key={i + 1}
                                control={
                                    <Checkbox
                                        checked={selectedMonths.includes(i + 1)}
                                        onChange={() => handleToggleMonth(i + 1)}
                                        sx={{
                                            "&.Mui-checked": { color: "primary.main" },
                                            "&:hover": { transform: "scale(1.1)", transition: "0.2s" },

                                        }}
                                    />
                                }
                                label={`Tháng ${i + 1}`}
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    transition: "0.3s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    "&:hover": { bgcolor: "#f5f5f5" }
                                }}
                            />
                        ))}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button onClick={handleCloseMonthDialog} color="secondary" variant="outlined">
                        Hủy
                    </Button>
                    <Button color="primary" variant="contained" onClick={handleExport}>
                        In
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

