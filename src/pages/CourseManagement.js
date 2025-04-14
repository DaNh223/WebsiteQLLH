
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    FormControl,
    InputLabel, Chip, Container, TableContainer, Paper
} from '@mui/material';

import { getAllCourses, addCourse, updateCourse, deleteCourse, addClass, updateClass, deleteClass } from '../api/courseApi';
import { getAllPrograms } from '../api/programApi';
import { getAllTeachers } from '../api/teacherApi';
import { toast } from 'react-toastify';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [openAddCourse, setOpenAddCourse] = useState(false);
    const [openEditCourse, setOpenEditCourse] = useState(false);
    const [openEditClass, setOpenEditClass] = useState(false);
    const [openClassDetail, setOpenClassDetail] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({
        tenKhoaHoc: '',
        maCtdt: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        ngayNghi: []
    });
    const [newClass, setNewClass] = useState([]);
    const [editClass, setEditClass] = useState([]);
    const [openAddClass, setOpenAddClass] = useState(false);
    const [editCourse, setEditCourse] = useState({
        tenKhoaHoc: '',
        maCtdt: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        ngayNghi: [],
    });
    const [deleteType, setDeleteType] = useState("");
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [allDates, setAllDates] = useState([]);
    const fetchCourse = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu khóa học:", error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchProgram = async () => {
        try {
            const data = await getAllPrograms();
            setPrograms(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu chương trình đào tạo:", error);
        }
    };

    useEffect(() => {
        fetchProgram();
    }, []);

    const fetchTeachers = async () => {
        try {
            const data = await getAllTeachers();
            setTeachers(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giảng viên:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);


    const handleOpenAddCourse = () => {
        setOpenAddCourse(true);
    };

    const handleCloseAddCourse = () => {
        setOpenAddCourse(false);
        setNewCourse({
            tenKhoaHoc: '',
            maCtdt: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ngayNghi: []
        });
    };

    const handleOpenEditCourse = (course) => {
        setEditCourse({
            ...course,
            ngayNghi: Array.isArray(course.ngayNghi)
                ? course.ngayNghi
                : JSON.parse(course.ngayNghi || '[]')
        });
        setOpenEditCourse(true);
    };

    const handleCloseEditCourse = () => {

        setEditCourse({
            tenKhoaHoc: '',
            maCtdt: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ngayNghi: [],
        })
        setOpenEditCourse(false);

    };

    const handleAddCourse = async () => {

        // Kiểm tra dữ liệu nhập vào
        if (!newCourse.tenKhoaHoc || newCourse.tenKhoaHoc.trim() === "") {
            toast.error("Vui lòng nhập tên khóa học.");
            return;
        }

        if (!newCourse.ngayBatDau) {
            toast.error("Vui lòng chọn ngày bắt đầu.");
            return;
        }

        if (!newCourse.ngayKetThuc) {
            toast.error("Vui lòng chọn ngày kết thúc.");
            return;
        }

        if (new Date(newCourse.ngayBatDau) > new Date(newCourse.ngayKetThuc)) {
            toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        if (!newCourse.maCtdt) {
            toast.error("Vui lòng chọn chương trình đào tạo.");
            return;
        }

        const newCourseData = {
            tenKhoaHoc: newCourse.tenKhoaHoc,
            ngayBatDau: newCourse.ngayBatDau,
            ngayKetThuc: newCourse.ngayKetThuc,
            maCtdt: newCourse.maCtdt,
            ngayNghi: JSON.stringify(newCourse.ngayNghi)
        }

        try {
            const response = await addCourse(newCourseData);
            toast.success(response.message || "Thêm khóa học thành công!");
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Lỗi khi thêm khóa học!");
            }
        } finally {
            await fetchCourse();
            handleCloseAddCourse();
        }
    }


    const handleEditCourse = async () => {

        // Kiểm tra dữ liệu nhập vào
        if (!editCourse.tenKhoaHoc || editCourse.tenKhoaHoc.trim() === "") {
            toast.error("Vui lòng nhập tên khóa học.");
            return;
        }

        if (!editCourse.ngayBatDau) {
            toast.error("Vui lòng chọn ngày bắt đầu.");
            return;
        }

        if (!editCourse.ngayKetThuc) {
            toast.error("Vui lòng chọn ngày kết thúc.");
            return;
        }

        if (new Date(editCourse.ngayBatDau) > new Date(editCourse.ngayKetThuc)) {
            toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        if (!editCourse.maCtdt) {
            toast.error("Vui lòng chọn chương trình đào tạo.");
            return;
        }

        const newCourseData = {
            tenKhoaHoc: editCourse.tenKhoaHoc,
            ngayBatDau: editCourse.ngayBatDau,
            ngayKetThuc: editCourse.ngayKetThuc,
            maCtdt: editCourse.maCtdt,
            ngayNghi: JSON.stringify(editCourse.ngayNghi)
        }

        console.log(newCourseData);

        try {
            const response = await updateCourse(editCourse.maKhoaHoc, newCourseData);
            toast.success(response.message || "Cập nhật khóa học thành công!");
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Lỗi khi sửa khóa học!");
            }
        } finally {
            await fetchCourse();
            handleCloseEditCourse();
        }
    }

    const handleOpenDeleteConfirm = (id, type) => {
        setDeleteType(type);
        setDeleteId(id);

        setOpenDeleteConfirm(true);

        console.log(type);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteType("");
        setDeleteId("");
        fetchCourse();
        setOpenDeleteConfirm(false);
    };

    const handleDelete = async () => {
        try {
            if (deleteType === "course") {
                await deleteCourse(deleteId);
                toast.success("Xóa khóa học thành công!");
            } else if (deleteType === "class") {
                await deleteClass(deleteId);
                setSelectedCourse(prev => ({
                    ...prev,
                    lopHocs: prev.lopHocs.filter(lop => lop.maLop !== deleteId)
                }));
                toast.success("Xóa lớp học thành công!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Xóa không thành công. Vui lòng thử lại!");
        } finally {
            handleCloseDeleteConfirm();
        }
    };


    // Hàm để tạo mảng tất cả các ngày trong một năm
    // const generateAllDatesOfYear = (year) => {
    //     const dates = [];
    //     const startDate = new Date(`${year}-01-01`);
    //     const endDate = new Date(`${year}-12-31`);
    //     for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    //         dates.push(new Date(d));
    //     }
    //     return dates;
    // };

    // Hàm tạo mảng tất cả các ngày trong khoảng từ start đến end
    const generateDatesInRange = (start, end) => {
        const dates = [];
        const startDate = new Date(start);
        const endDate = new Date(end);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d).toISOString().split('T')[0]); // Format: YYYY-MM-DD
        }

        return dates;
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    };
    // Tạo tất cả các ngày trong năm (ví dụ: năm 2025)
    // const allDates = generateAllDatesOfYear(2025);
    useEffect(() => {
        const { ngayBatDau, ngayKetThuc } = newCourse;
        if (ngayBatDau && ngayKetThuc) {
            const dates = generateDatesInRange(ngayBatDau, ngayKetThuc);
            setAllDates(dates);
        } else {
            setAllDates([]);
        }
    }, [newCourse.ngayBatDau, newCourse.ngayKetThuc, newCourse]);


    const handleDeleteHolidayDate = (dateToDelete) => {
        setNewCourse((prev) => ({
            ...prev,
            ngayNghi: prev.ngayNghi.filter((d) => d !== dateToDelete),
        }));
    };

    const handleHolidayChange = (e) => {
        const selectedDates = e.target.value; // Lấy tất cả các ngày đã chọn
        setNewCourse({
            ...newCourse,
            ngayNghi: selectedDates,
        });
    };

    const handleEditHolidayChange = (e) => {
        const selectedEditDates = e.target.value; // Lấy tất cả các ngày đã chọn
        setEditCourse({
            ...editCourse,
            ngayNghi: selectedEditDates,
        });
    };

    const handleDeleteEditHolidayDate = (dateToDelete) => {
        setEditCourse((prev) => {
            const ngayNghiArray = Array.isArray(prev.ngayNghi)
                ? prev.ngayNghi
                : JSON.parse(prev.ngayNghi || "[]");

            return {
                ...prev,
                ngayNghi: ngayNghiArray.filter((d) => d !== dateToDelete),
            };
        });
    };


    const handleOpenAddClass = () => {
        setOpenAddClass(true);
    };

    const handleCloseAddClass = () => {
        setOpenAddClass(false);
        setNewClass({
            tenKhoaHoc: '',
            maCtdt: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ngayNghi: []
        });
    };

    const handleAddClass = async () => {
        // Kiểm tra dữ liệu nhập vào
        if (!newClass.tenLop || newClass.tenLop.trim() === "") {
            toast.error("Vui lòng nhập tên lớp học.");
            return;
        }

        if (!newClass.diaDiem || newClass.diaDiem.trim() === "") {
            toast.error("Vui lòng nhập địa điểm học.");
            return;
        }

        if (!newClass.maGv) {
            toast.error("Vui lòng chọn giáo viên chủ nhiệm.");
            return;
        }

        const newClassData = {
            tenLop: newClass.tenLop,
            diaDiem: newClass.diaDiem,
            maGv: newClass.maGv,
        }


        try {
            const response = await addClass(selectedCourse.maKhoaHoc, newClassData);
            toast.success(response.message); // Thông báo thành công


            const createdClass = response.newClass;

            console.log(response);

            // Cập nhật vào selectedCourse để hiển thị ngay trong dialog
            setSelectedCourse(prev => ({
                ...prev,
                lopHocs: [...prev.lopHocs, createdClass]
            }));

        } catch (error) {
            toast.error(error.message || "Lỗi khi thêm lớp học!");
        } finally {
            handleCloseAddClass();
            fetchCourse();
        }

    }


    const handleOpenEditClass = (cls) => {
        setEditClass(cls);
        setOpenEditClass(true);
    };

    const handleCloseEditClass = () => {
        setEditClass([])
        setOpenEditClass(false);
    };


    const handleEditClass = async () => {

        // Kiểm tra dữ liệu nhập vào
        if (!editClass.tenLop || editClass.tenLop.trim() === "") {
            toast.error("Vui lòng nhập tên lớp học.");
            return;
        }

        if (!editClass.diaDiem || editClass.diaDiem.trim() === "") {
            toast.error("Vui lòng nhập địa điểm học.");
            return;
        }

        if (!editClass.maGv) {
            toast.error("Vui lòng chọn giáo viên chủ nhiệm.");
            return;
        }

        const newClassData = {
            tenLop: editClass.tenLop,
            diaDiem: editClass.diaDiem,
            maGv: editClass.maGv,
        }

        console.log(newClassData);

        try {
            const response = await updateClass(editClass.maLop, newClassData);
            toast.success(response.message); // Thông báo thành công

            console.log(response);

            const editedClass = response.editClass;
            setSelectedCourse(prev => ({
                ...prev,
                lopHocs: prev.lopHocs.map(lop =>
                    lop.maLop === editedClass.maLop ? editedClass : lop
                )
            }));

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Lỗi khi sửa lớp học!");
        } finally {
            handleCloseEditClass();
        }
    }


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom >
                Quản Lý Khóa Học
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Quản lý Khóa học</Typography>
                    <Button variant="contained" onClick={handleOpenAddCourse}>
                        Thêm Khóa học
                    </Button>
                </Stack> */}
                <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button variant="contained" onClick={handleOpenAddCourse}>
                        Thêm Khóa học
                    </Button>
                </Box>
                <TableContainer component={Paper} fullWidth>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Mã Khóa</TableCell>
                                <TableCell align="center">Tên Khóa</TableCell>
                                <TableCell align="center">Chương Trình Đào Tạo</TableCell>
                                <TableCell align="center">Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.maKhoaHoc}>
                                    <TableCell align="center">{course.maKhoaHoc}</TableCell>
                                    <TableCell align="center">{course.tenKhoaHoc}</TableCell>
                                    <TableCell align="center">{course.tenCtdt}</TableCell>
                                    <TableCell align="center">
                                        {/* <Stack direction="row" spacing={1}> */}
                                        <Button variant="contained" sx={{ mx: 1 }} onClick={() => {
                                            setSelectedCourse(course);
                                            setOpenClassDetail(true);
                                        }}>Chi tiết lớp học</Button>
                                        <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleOpenEditCourse(course)}>Sửa</Button>
                                        <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(course.maKhoaHoc, "course")}>Xóa</Button>
                                        {/* </Stack> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    selectedCourse && (
                        <Dialog open={openClassDetail} onClose={() => setOpenClassDetail(false)} fullWidth maxWidth="md">
                            <DialogTitle>
                                Danh sách lớp học của khóa: {selectedCourse?.tenKhoaHoc}
                                <Button
                                    variant="contained"
                                    sx={{ float: 'right' }}
                                    onClick={
                                        handleOpenAddClass
                                    }
                                >
                                    Thêm lớp
                                </Button>
                            </DialogTitle>
                            <DialogContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Mã lớp</TableCell>
                                            <TableCell align="center">Tên lớp</TableCell>
                                            <TableCell align="center">Địa điểm học</TableCell>
                                            <TableCell align="center">GVCN</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedCourse.lopHocs.map((cls) => (
                                            <TableRow key={cls.maLop}>
                                                <TableCell align="center">{cls.maLop}</TableCell>
                                                <TableCell align="center">{cls.tenLop}</TableCell>
                                                <TableCell align="center">{cls.diaDiem}</TableCell>
                                                <TableCell align="center">{cls.tenGv}</TableCell>
                                                <TableCell align="center">
                                                    {/* <Stack direction="row" spacing={1}> */}
                                                    <Button variant="contained" color='warning' sx={{ mx: 1 }} onClick={() => handleOpenEditClass(cls)}>Sửa</Button>
                                                    <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(cls.maLop, "class")}>Xóa</Button>
                                                    {/* </Stack> */}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => setOpenClassDetail(false)} color="secondary">Đóng</Button>
                            </DialogActions>
                        </Dialog>
                    )
                }

                <Dialog open={openAddCourse} onClose={handleCloseAddCourse}>
                    <DialogTitle>Thêm khóa học</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Tên khóa"
                            value={newCourse.tenKhoaHoc || ""}
                            onChange={(e) => setNewCourse({ ...newCourse, tenKhoaHoc: e.target.value })}
                        />
                        <FormControl fullWidth >
                            <InputLabel sx={{ background: "white" }}>Chương trình học</InputLabel>
                            <Select value={newCourse.maCtdt || ""} onChange={(e) => setNewCourse({ ...newCourse, maCtdt: e.target.value })}>
                                {programs.map((ct) => (
                                    <MenuItem key={ct.maCtdt} value={ct.maCtdt}>{ct.tenCtdt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="dense"
                            type="date"
                            label="Ngày bắt đầu"
                            InputLabelProps={{ shrink: true }}
                            value={newCourse.ngayBatDau || ''}
                            onChange={(e) => setNewCourse({ ...newCourse, ngayBatDau: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            type="date"
                            label="Ngày kết thúc"
                            InputLabelProps={{ shrink: true }}
                            value={newCourse.ngayKetThuc || ''}
                            onChange={(e) => setNewCourse({ ...newCourse, ngayKetThuc: e.target.value })}
                        />

                        {/* Trường nhập ngày nghỉ sử dụng Select multi */}
                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }} disabled={!newCourse.ngayBatDau || !newCourse.ngayKetThuc}>
                            <InputLabel sx={{ background: "white" }}>Ngày nghỉ</InputLabel>
                            <Select
                                multiple
                                value={newCourse.ngayNghi || []}
                                onChange={handleHolidayChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((date) => {
                                            // const teacher = teachers.find((t) => t.maGv === id);
                                            return (
                                                <Chip
                                                    key={date}
                                                    label={formatDate(date)}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onDelete={() => {
                                                        handleDeleteHolidayDate(date)
                                                    }}
                                                    sx={{
                                                        zIndex: 3000,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                                MenuProps={{
                                    // disablePortal: true, // Ngừng mở dropdown khi chọn hoặc xóa
                                    sx: { zIndex: 2000 },
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200, // Giới hạn chiều cao của danh sách
                                            overflowY: 'auto' // Cho phép cuộn khi danh sách quá dài
                                        }
                                    }
                                }}
                                disableCloseOnSelect // Prevent closing the dropdown when a chip is deleted
                            >
                                {allDates.map((date) => (
                                    <MenuItem key={date} value={date || ''}>
                                        {formatDate(date)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddCourse} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddCourse}>Thêm</Button>
                    </DialogActions>
                </Dialog>

                {editCourse && (
                    <Dialog open={openEditCourse} onClose={handleCloseEditCourse}>
                        <DialogTitle>Sửa khóa học</DialogTitle>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Tên khóa"
                                value={editCourse.tenKhoaHoc || ""}
                                onChange={(e) => setEditCourse({ ...editCourse, tenKhoaHoc: e.target.value })}
                            />
                            <FormControl fullWidth >
                                <InputLabel sx={{ background: "white" }}>Chương trình học</InputLabel>
                                <Select value={editCourse.maCtdt || ""} onChange={(e) => setEditCourse({ ...editCourse, maCtdt: e.target.value })}>
                                    {programs.map((ct) => (
                                        <MenuItem key={ct.maCtdt} value={ct.maCtdt}>{ct.tenCtdt}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="date"
                                label="Ngày bắt đầu"
                                InputLabelProps={{ shrink: true }}
                                value={editCourse.ngayBatDau || ""}
                                onChange={(e) => setEditCourse({ ...editCourse, ngayBatDau: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                type="date"
                                label="Ngày kết thúc"
                                InputLabelProps={{ shrink: true }}
                                value={editCourse.ngayKetThuc || ""}
                                onChange={(e) => setEditCourse({ ...editCourse, ngayKetThuc: e.target.value })}
                            />

                            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                <InputLabel sx={{ background: "white" }}>Ngày nghỉ</InputLabel>
                                <Select
                                    multiple
                                    value={editCourse.ngayNghi || []}
                                    onChange={handleEditHolidayChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((date) => {
                                                // const teacher = teachers.find((t) => t.maGv === id);
                                                return (
                                                    <Chip
                                                        key={date}
                                                        label={formatDate(date)}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onDelete={() => {
                                                            handleDeleteEditHolidayDate(date)
                                                        }}
                                                        sx={{
                                                            zIndex: 3000,
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={{
                                        // disablePortal: true, // Ngừng mở dropdown khi chọn hoặc xóa
                                        sx: { zIndex: 2000 },
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200, // Giới hạn chiều cao của danh sách
                                                overflowY: 'auto' // Cho phép cuộn khi danh sách quá dài
                                            }
                                        }
                                    }}
                                // disableCloseOnSelect={true} // Prevent closing the dropdown when a chip is deleted
                                >
                                    {allDates.map((date) => (
                                        <MenuItem key={date} value={date || ""}>
                                            {formatDate(date)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditCourse} color="secondary">Hủy</Button>
                            <Button variant="contained" onClick={handleEditCourse}>Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}


                {deleteType && (
                    <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {deleteType === "course"
                                    ? "Bạn có chắc chắn muốn xóa chương trình đào tạo này?"
                                    : deleteType === "class"
                                        ? "Bạn có chắc chắn muốn xóa lớp này?"
                                        : "Bạn có chắc chắn muốn xóa mục này?"}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteConfirm} color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={handleDelete} variant="contained" color="error">
                                Xóa
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
                }


                <Dialog open={openAddClass} onClose={handleCloseAddClass}>
                    <DialogTitle>Thêm lớp học</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Tên lớp"
                            value={newClass.tenLop || ""}
                            onChange={(e) => setNewClass({ ...newClass, tenLop: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Địa điểm học"
                            value={newClass.diaDiem || ""}
                            onChange={(e) => setNewClass({ ...newClass, diaDiem: e.target.value })}
                        />

                        <FormControl fullWidth >
                            <InputLabel sx={{ background: "white" }}>GVCN</InputLabel>
                            <Select value={newClass.maGv || ""} onChange={(e) => setNewClass({ ...newClass, maGv: e.target.value })}>
                                {teachers.map((gv) => (
                                    <MenuItem key={gv.maGv} value={gv.maGv}>{gv.tenGv}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddClass} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddClass}>Thêm</Button>
                    </DialogActions>
                </Dialog>

                {editClass && (
                    <Dialog open={openEditClass} onClose={handleCloseEditClass}>
                        <DialogTitle>Sửa lớp học</DialogTitle>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Tên lớp"
                                value={editClass.tenLop || ""}
                                onChange={(e) => setEditClass({ ...editClass, tenLop: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Địa điểm học"
                                value={editClass.diaDiem || ""}
                                onChange={(e) => setEditClass({ ...editClass, diaDiem: e.target.value })}
                            />

                            <FormControl fullWidth >
                                <InputLabel sx={{ background: "white" }}>GVCN</InputLabel>
                                <Select value={editClass.maGv || ""} onChange={(e) => setEditClass({ ...editClass, maGv: e.target.value })}>
                                    {teachers.map((gv) => (
                                        <MenuItem key={gv.maGv} value={gv.maGv}>{gv.tenGv}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditClass} color="secondary">Hủy</Button>
                            <Button variant="contained" onClick={handleEditClass}>Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box >
        </Container>

    );
};

export default CourseManagement;