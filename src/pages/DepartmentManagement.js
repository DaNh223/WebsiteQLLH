
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
    InputLabel, Container, TableContainer, Paper
} from '@mui/material';

import { getAllDepartment, addDepartment, updateDepartment, deleteDepartment, addTeacher, updateTeacher, deleteTeacher } from '../api/departmentApi';

import { toast } from 'react-toastify';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [openAddDepartment, setOpenAddDepartment] = useState(false);
    const [newDepartment, setNewDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [openTeacherDetail, setOpenTeacherDetail] = useState(false);
    const [openEditDepartment, setOpenEditDepartment] = useState(false);
    const [editDepartment, setEditDepartment] = useState([]);


    const [openEditTeacher, setOpenEditTeacher] = useState(false);
    const [newTeacher, setNewTeacher] = useState([]);
    const [editTeacher, setEditTeacher] = useState([]);
    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [deleteType, setDeleteType] = useState("");
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const fetchDepartment = async () => {
        try {
            const data = await getAllDepartment();
            setDepartments(data);
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đơn vị:", error);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, []);


    const handleOpenAddDepartment = () => {
        setOpenAddDepartment(true);
    };

    const handleCloseAddDepartment = () => {
        setOpenAddDepartment(false);
        setNewDepartment([]);
    };

    const handleOpenEditDepartment = (department) => {
        console.log(department)
        setEditDepartment(department);
        setOpenEditDepartment(true);
    };

    const handleCloseEditDepartment = () => {
        setEditDepartment([])
        setOpenEditDepartment(false);
    };

    const handleAddDepartment = async () => {
        // Kiểm tra dữ liệu nhập vào
        if (!newDepartment.tenDonVi || newDepartment.tenDonVi.trim() === "") {
            toast.error("Vui lòng nhập tên đơn vị.");
            return;
        }

        if (!newDepartment.loaiDonVi) {
            toast.error("Vui lòng chọn loại đơn vị.");
            return;
        }

        const newDepartmentData = {
            tenDonVi: newDepartment.tenDonVi.trim(),
            loaiDonVi: newDepartment.loaiDonVi,
        };

        try {
            // // Gọi API thêm đơn vị
            const response = await addDepartment(newDepartmentData);
            toast.success(response.message || "Thêm đơn vị thành công!");
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Lỗi khi thêm đơn vị!");
            }
        } finally {
            await fetchDepartment(); // Cập nhật lại danh sách đơn vị nếu cần
            handleCloseAddDepartment(); // Đóng dialog
        }
    };


    const handleEditDepartment = async () => {

        // Kiểm tra dữ liệu nhập vào
        if (!editDepartment.tenDonVi || editDepartment.tenDonVi.trim() === "") {
            toast.error("Vui lòng nhập tên đơn vị.");
            return;
        }

        if (!editDepartment.loaiDonVi) {
            toast.error("Vui lòng chọn loại đơn vị.");
            return;
        }

        const newDepartmentData = {
            tenDonVi: editDepartment.tenDonVi.trim(),
            loaiDonVi: editDepartment.loaiDonVi,
        };

        try {
            const response = await updateDepartment(editDepartment.maDonVi, newDepartmentData);
            toast.success(response.message || "Cập nhật đơn vị thành công!");
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Lỗi khi sửa đơn vị!");
            }
        } finally {
            await fetchDepartment();
            handleCloseEditDepartment();
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
        fetchDepartment();
        setOpenDeleteConfirm(false);
    };

    const handleDelete = async () => {
        try {
            if (deleteType === "department") {

                const response = await deleteDepartment(deleteId);
                toast.success(response.message || "Xóa đơn vị thành công!");

            } else if (deleteType === "teacher") {


                await deleteTeacher(deleteId);
                setSelectedDepartment(prev => ({
                    ...prev,
                    giangViens: prev.giangViens.filter(gv => gv.maGv !== deleteId)
                }));
                toast.success("Xóa giảng viên thành công!");
            }
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Lỗi khi xóa!");
            }
        } finally {
            handleCloseDeleteConfirm();
        }
    };

    const handleOpenAddTeacher = () => {
        setOpenAddTeacher(true);
    };

    const handleCloseAddTeacher = () => {
        setOpenAddTeacher(false);
        setNewTeacher({
            tenKhoaHoc: '',
            maCtdt: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ngayNghi: []
        });
    };

    const handleAddTeacher = async () => {
        // Kiểm tra dữ liệu nhập vào
        if (!newTeacher.tenGv || newTeacher.tenGv.trim() === "") {
            toast.error("Vui lòng nhập tên giảng viên.");
            return;
        }

        if (!newTeacher.chucVu) {
            toast.error("Vui lòng chọn chức vụ.");
            return;
        }


        const newTeacherData = {
            tenGv: newTeacher.tenGv,
            chucVu: newTeacher.chucVu,
            chucDanh: newTeacher.chucDanh,
        }

        try {
            const response = await addTeacher(selectedDepartment.maDonVi, newTeacherData);
            toast.success(response.message); // Thông báo thành công

            const createdTeacher = response.newTeacher;

            console.log(response);

            // Cập nhật vào selectedDepartment để hiển thị ngay trong dialog
            setSelectedDepartment(prev => ({
                ...prev,
                giangViens: [...prev.giangViens, createdTeacher]
            }));

        } catch (error) {
            toast.error(error.message || "Lỗi khi thêm giảng viên!");
        } finally {
            handleCloseAddTeacher();
            fetchDepartment();
        }
    }


    const handleOpenEditTeacher = (t) => {
        setEditTeacher(t);
        setOpenEditTeacher(true);
    };

    const handleCloseEditTeacher = () => {
        setEditTeacher([])
        setOpenEditTeacher(false);
    };


    const handleEditTeacher = async () => {
        // Kiểm tra dữ liệu nhập vào
        if (!editTeacher.tenGv || editTeacher.tenGv.trim() === "") {
            toast.error("Vui lòng nhập tên giảng viên.");
            return;
        }
        if (!editTeacher.chucVu) {
            toast.error("Vui lòng chọn chức vụ.");
            return;
        }

        const editTeacherData = {
            tenGv: editTeacher.tenGv,
            chucVu: editTeacher.chucVu,
            chucDanh: editTeacher.chucDanh,
        }

        console.log(editTeacherData);

        try {
            const response = await updateTeacher(editTeacher.maGv, editTeacherData);
            toast.success(response.message); // Thông báo thành công

            console.log(response);

            const editedTeacher = response.editTeacher;
            setSelectedDepartment(prev => ({
                ...prev,
                giangViens: prev.giangViens.map(gv =>
                    gv.maGv === editedTeacher.maGv ? editedTeacher : gv
                )
            }));

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Lỗi khi sửa giảng viên!");
        } finally {
            handleCloseEditTeacher();
        }
    }


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom >
                Quản Lý Tổ Chức & Nhân Sự
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button variant="contained" onClick={handleOpenAddDepartment}>
                        Thêm Đơn Vị
                    </Button>
                </Box>
                <TableContainer component={Paper} fullWidth>
                    <Table >
                        <TableHead>
                            <TableRow>
                                {/* <TableCell align="center">Mã Khóa</TableCell> */}
                                <TableCell align="center">Tên Đơn Vị</TableCell>
                                <TableCell align="center">Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.map((dp) => (
                                <TableRow key={dp.maDonVi}>
                                    <TableCell align="center">{dp.tenDonVi}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" sx={{ mx: 1 }} onClick={() => {
                                            setSelectedDepartment(dp);
                                            setOpenTeacherDetail(true);
                                        }}>Chi tiết nhân sự</Button>

                                        {/* <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleOpenEditDepartment(dp)}>Sửa</Button>
                                        <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(dp.maDonVi, "department")}>Xóa</Button> */}

                                        {/* Nếu không phải là BGH thì hiển thị nút Sửa và Xóa */}
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            sx={{ mx: 1 }}
                                            onClick={() => handleOpenEditDepartment(dp)}
                                            disabled={dp.loaiDonVi?.toLowerCase() === "bgh"}
                                        >
                                            Sửa
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ mx: 1 }}
                                            onClick={() => handleOpenDeleteConfirm(dp.maDonVi, "department")}
                                            disabled={dp.loaiDonVi?.toLowerCase() === "bgh"}
                                        >
                                            Xóa
                                        </Button>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {
                    selectedDepartment && (
                        <Dialog open={openTeacherDetail} onClose={() => setOpenTeacherDetail(false)} fullWidth maxWidth="md">
                            <DialogTitle>
                                Danh sách giáo viên của đơn vị: {selectedDepartment?.tenDonVi}
                                <Button
                                    variant="contained"
                                    sx={{ float: 'right' }}
                                    onClick={
                                        handleOpenAddTeacher
                                    }
                                >
                                    Thêm giảng viên
                                </Button>
                            </DialogTitle>
                            <DialogContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Mã GV</TableCell>
                                            <TableCell align="center">Tên GV</TableCell>
                                            <TableCell align="center">Chức vụ</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedDepartment.giangViens.map((t) => (
                                            <TableRow key={`${t.maGv}`}>
                                                <TableCell align="center">{t.maGv}</TableCell>
                                                <TableCell align="center">{t.tenGv}</TableCell>
                                                <TableCell align="center">{t.chucVu}</TableCell>
                                                <TableCell align="center">
                                                    <Button variant="contained" color='warning' sx={{ mx: 1 }} onClick={() => handleOpenEditTeacher(t)}>Sửa</Button>
                                                    <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(t.maGv, "teacher")}>Xóa</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => setOpenTeacherDetail(false)} color="secondary">Đóng</Button>
                            </DialogActions>
                        </Dialog>
                    )
                }

                <Dialog open={openAddDepartment} onClose={handleCloseAddDepartment}>
                    <DialogTitle>Thêm đơn vị</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Tên đơn vị"
                            value={newDepartment.tenDonVi || ""}
                            onChange={(e) => setNewDepartment({ ...newDepartment, tenDonVi: e.target.value })}
                        />

                        <FormControl fullWidth margin="dense">
                            <InputLabel>Loại đơn vị</InputLabel>
                            <Select
                                value={newDepartment.loaiDonVi || ""}
                                label="Loại đơn vị"
                                onChange={(e) => setNewDepartment({ ...newDepartment, loaiDonVi: e.target.value })}
                            >
                                <MenuItem value="phong">Phòng</MenuItem>
                                <MenuItem value="khoa">Khoa</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDepartment} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddDepartment}>Thêm</Button>
                    </DialogActions>
                </Dialog>

                {editDepartment && (
                    <Dialog open={openEditDepartment} onClose={handleCloseEditDepartment}>
                        <DialogTitle>Sửa đơn vị</DialogTitle>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Tên đơn vị"
                                value={editDepartment.tenDonVi || ""}
                                onChange={(e) => setEditDepartment({ ...editDepartment, tenDonVi: e.target.value })}
                            />
                            <FormControl fullWidth >
                                <InputLabel sx={{ background: "white" }}>Loại đơn vị</InputLabel>
                                <Select value={editDepartment.loaiDonVi || ""} onChange={(e) => setEditDepartment({ ...editDepartment, loaiDonVi: e.target.value })}>
                                    <MenuItem value="phong">Phòng</MenuItem>
                                    <MenuItem value="khoa">Khoa</MenuItem>
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditDepartment} color="secondary">Hủy</Button>
                            <Button variant="contained" onClick={handleEditDepartment}>Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}


                {deleteType && (
                    <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {deleteType === "department"
                                    ? "Bạn có chắc chắn muốn xóa đơn vị này?"
                                    : deleteType === "teacher"
                                        ? "Bạn có chắc chắn muốn xóa giảng viên này?"
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

                <Dialog open={openAddTeacher} onClose={handleCloseAddTeacher}>
                    <DialogTitle>Thêm giảng viên</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Tên giảng viên"
                            value={newTeacher.tenGv || ""}
                            onChange={(e) => setNewTeacher({ ...newTeacher, tenGv: e.target.value })}
                        />

                        <FormControl fullWidth>
                            <InputLabel sx={{ background: "white" }}>Chức vụ</InputLabel>
                            <Select
                                value={newTeacher.chucVu || ""}
                                onChange={(e) => setNewTeacher({ ...newTeacher, chucVu: e.target.value })}
                            >
                                {(selectedDepartment?.loaiDonVi === "phong" ?
                                    ["Trưởng phòng", "Phó trưởng phòng", "Giảng viên"] :
                                    ["Trưởng khoa", "Phó trưởng khoa", "Giảng viên"]
                                ).map((chucVu) => (
                                    <MenuItem key={chucVu} value={chucVu}>{chucVu}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel sx={{ background: "white" }}>Chức danh</InputLabel>
                            <Select
                                value={newTeacher.chucDanh || ""}
                                onChange={(e) => setNewTeacher({ ...newTeacher, chucDanh: e.target.value })}
                            >
                                {["GVCC", "GVC"].map((cd) => (
                                    <MenuItem key={cd} value={cd}>{cd}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseAddTeacher} color="secondary">Hủy</Button>
                        <Button variant="contained"
                            onClick={handleAddTeacher}
                        >Thêm</Button>
                    </DialogActions>
                </Dialog>


                {editTeacher && (
                    <Dialog open={openEditTeacher} onClose={handleCloseEditTeacher}>
                        <DialogTitle>Sửa giảng viên</DialogTitle>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Tên giảng viên"
                                value={editTeacher.tenGv || ""}
                                onChange={(e) => setEditTeacher({ ...editTeacher, tenGv: e.target.value })}
                            />

                            <FormControl fullWidth >
                                <InputLabel sx={{ background: "white" }}>Chức vụ</InputLabel>
                                <Select value={editTeacher.chucVu || ""} onChange={(e) => setEditTeacher({ ...editTeacher, chucVu: e.target.value })}>
                                    {(selectedDepartment?.loaiDonVi === "phong" ?
                                        ["Trưởng phòng", "Phó trưởng phòng", "Giảng viên"] :
                                        ["Trưởng khoa", "Phó trưởng khoa", "Giảng viên"]
                                    ).map((chucVu) => (
                                        <MenuItem key={chucVu} value={chucVu}>{chucVu}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth >
                                <InputLabel sx={{ background: "white" }}>Chức danh</InputLabel>
                                <Select value={editTeacher.chucDanh || ""} onChange={(e) => setEditTeacher({ ...editTeacher, chucDanh: e.target.value })}>
                                    {["GVCC", "GVC"].map((cd) => (
                                        <MenuItem key={cd} value={cd}>{cd}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditTeacher} color="secondary">Hủy</Button>
                            <Button variant="contained" onClick={handleEditTeacher}>Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box >
        </Container >

    );
};

export default DepartmentManagement;