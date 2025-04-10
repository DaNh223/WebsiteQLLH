import React, { useState, useEffect } from "react";
import {
    Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Chip,
    Container
} from "@mui/material";
import { getAllPrograms, addProgram, updateProgram, deleteProgramFunc, addPart, updatePart, deletePartFunc, addLesson, updateLesson, deleteLessonFunc } from "../api/programApi";
import { getAllTeachers } from "../api/teacherApi";

import { toast } from 'react-toastify';

const ProgramManagement = () => {
    const [openSections, setOpenSections] = useState(false);
    const [openLessons, setOpenLessons] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [editProgram, setEditProgram] = useState([]);
    const [sections, setSections] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [openAddProgram, setOpenAddProgram] = useState(false);
    const [openEditProgram, setOpenEditProgram] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [editPart, setEditPart] = useState([]);
    const [openAddPart, setOpenAddPart] = useState(false);
    const [openEditPart, setOpenEditPart] = useState(false);
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [partName, setPartName] = useState("");
    const [deleteType, setDeleteType] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [openAddLesson, setOpenAddLesson] = useState(false);
    const [lessonName, setLessonName] = useState("");
    const [lessonHours, setLessonHours] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const [editLesson, setEditLesson] = useState([]);
    const [editSelectedTeachers, setEditSelectedTeachers] = useState([]);
    const [openEditLesson, setOpenEditLesson] = useState(false);


    const fetchPrograms = async () => {
        try {
            const data = await getAllPrograms();
            setPrograms(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu chương trình đào tạo:", error);
        }
    };

    useEffect(() => {
        fetchPrograms();
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

    const handleOpenSections = (program) => {
        setSections(program.phanHocs || []);
        setEditProgram(program);
        setOpenSections(true);
    };

    const handleOpenLessons = (section) => {
        setLessons(section.baiHocs || []);
        setEditPart(section);
        setOpenLessons(true);
    };

    const handleOpenAddProgram = () => setOpenAddProgram(true);
    const handleCloseAddProgram = () => {
        setProgramName("");
        setProgramDescription("");
        fetchPrograms();
        setOpenAddProgram(false)
    };

    const handleOpenEditProgram = (program) => {
        setEditProgram(program)
        setOpenEditProgram(true);
    };

    const handleCloseEditProgram = () => {
        setEditProgram([]);
        fetchPrograms();
        setOpenEditProgram(false)
    };

    const handleAddProgram = async () => {

        if (!programName?.trim()) {
            toast.warning("Vui lòng nhập tên chương trình đào tạo");
            return;
        }

        if (!programDescription?.trim()) {
            toast.warning("Vui lòng nhập mô tả chương trình đào tạo");
            return;
        }

        const newProgram = {
            tenCtdt: programName,
            moTa: programDescription,
        };

        try {
            await addProgram(newProgram);  // Gọi API để thêm chương trình đào tạo
            toast.success("Thêm chương trình đào tạo thành công");
            handleCloseAddProgram();  // Đóng dialog sau khi thêm
        } catch (error) {
            console.error("Lỗi khi thêm chương trình:", error);
            toast.error("Thêm chương trình đào tạo thất bại");
        }
    };

    const handleEditProgram = async () => {

        if (!editProgram?.tenCtdt?.trim()) {
            toast.warning("Vui lòng nhập tên chương trình đào tạo");
            return;
        }

        if (!editProgram?.moTa?.trim()) {
            toast.warning("Vui lòng nhập mô tả chương trình đào tạo");
            return;
        }

        const updatedProgram = {
            tenCtdt: editProgram.tenCtdt,
            moTa: editProgram.moTa,
        };

        console.log(editProgram)
        try {
            await updateProgram(editProgram.maCtdt, updatedProgram);  // Gọi API để sửa chương trình đào tạo
            handleCloseEditProgram();  // Đóng dialog sau khi sửa
            toast.success("Cập nhật chương trình đào tạo thành công");
        } catch (error) {
            console.error("Lỗi khi sửa chương trình:", error);
            toast.error("Cập nhật chương trình đào tạo thất bại");
        }
    };

    const handleOpenDeleteConfirm = (id, type) => {
        setDeleteType(type);
        setDeleteId(id);
        setOpenDeleteConfirm(true);
        console.log(type);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteType("");
        setDeleteId("");
        fetchPrograms();
        setOpenDeleteConfirm(false);
    };

    const handleDelete = async () => {
        try {
            if (deleteType === "program") {
                await deleteProgramFunc(deleteId);
                toast.success("Đã xóa chương trình đào tạo thành công");
                fetchPrograms();
            } else if (deleteType === "part") {
                await deletePartFunc(deleteId);
                setSections(prev => prev.filter(part => part.maPhan !== deleteId));
                toast.success("Đã xóa phần học thành công");
            }
            else if (deleteType === "lesson") {
                await deleteLessonFunc(deleteId);
                setLessons(prev => prev.filter(lesson => lesson.maBai !== deleteId));
                toast.success("Đã xóa bài học thành công");
            }
        } catch (error) {
            console.error(error);
            toast.error("Xóa không thành công. Vui lòng thử lại!");
        } finally {
            handleCloseDeleteConfirm();
        }
    };


    const handleOpenAddPart = () => {
        console.log("Mở dialog thêm phần");
        setOpenAddPart(true);
    };

    const handleCloseAddPart = () => {
        setPartName("");
        fetchPrograms();
        setOpenAddPart(false);
    };

    const handleAddPart = async () => {
        if (!partName?.trim()) {
            toast.warning("Vui lòng nhập tên phần học");
            return;
        }

        const newPart = {
            tenPhan: partName,
        };

        try {
            const createdPart = await addPart(editProgram.maCtdt, newPart);  // Gọi API để thêm chương trình đào tạo
            setSections([...sections, createdPart.newPart]); // Cập nhật trực tiếp danh sách phần học
            toast.success("Thêm phần học thành công");

            handleCloseAddPart();  // Đóng dialog sau khi thêm

            console.log(createdPart);
        } catch (error) {
            console.error("Lỗi khi thêm phần học:", error);
            toast.error("Thêm phần học thất bại. Vui lòng thử lại!");
        }
    };

    const handleOpenEditPart = (part) => {
        setEditPart(part)
        setOpenEditPart(true);
    };

    const handleCloseEditPart = () => {
        setEditPart([]);
        fetchPrograms();
        setOpenEditPart(false)
    };

    const handleEditPart = async () => {
        if (!editPart?.tenPhan?.trim()) {
            toast.warning("Vui lòng nhập tên phần học");
            return;
        }

        const updatedPart = {
            tenPhan: editPart.tenPhan,
        };

        console.log(editPart)
        try {
            await updatePart(editPart.maPhan, updatedPart);
            setSections(sections.map(part =>
                part.maPhan === editPart.maPhan ? { ...part, tenPhan: editPart.tenPhan } : part
            )); // Cập nhật trực tiếp danh sách phần học

            toast.success("Cập nhật phần học thành công");
            handleCloseEditPart();  // Đóng dialog sau khi sửa
        } catch (error) {
            console.error("Lỗi khi sửa phần hoc:", error);
            // const errMsg = error?.message || "Cập nhật phần học thất bại. Vui lòng thử lại!";
            toast.error("Cập nhật phần học thất bại. Vui lòng thử lại!");
        }
    };

    // Xóa giảng viên khỏi danh sách đã chọn
    const handleDeleteTeacher = (teacherId) => {
        setSelectedTeachers((prev) => prev.filter((id) => id !== teacherId));
    };

    const handleOpenAddLesson = () => {
        setOpenAddLesson(true);
    };

    const handleCloseAddLesson = () => {
        setLessonName("");
        setLessonHours("");
        setSelectedTeachers([]);
        fetchPrograms();
        setOpenAddLesson(false);
    };

    // Xử lý khi nhấn nút "Thêm"
    const handleAddLesson = async () => {
        if (!lessonName?.trim()) {
            toast.warning("Vui lòng nhập tên bài học");
            return;
        }

        if (!lessonHours || isNaN(lessonHours) || Number(lessonHours) <= 0) {
            toast.warning("Vui lòng nhập số tiết hợp lệ");
            return;
        }

        if (selectedTeachers.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một giảng viên");
            return;
        }

        const newLesson = {
            tenBai: lessonName,
            soTiet: Number(lessonHours),
            maGvs: selectedTeachers,
        };

        try {
            const createdLesson = await addLesson(editPart.maPhan, newLesson);  // Gọi API để thêm chương trình đào tạo

            console.log(createdLesson.baiHoc);
            setLessons([...lessons, createdLesson.baiHoc]); // Cập nhật trực tiếp danh sách phần học
            toast.success("Thêm bài học thành công");
            handleCloseAddLesson();  // Đóng dialog sau khi thêm
        } catch (error) {
            console.error("Lỗi khi thêm bài học:", error);
            // const errMsg = error?.message || "Thêm bài học thất bại. Vui lòng thử lại!";
            toast.error("Thêm bài học thất bại. Vui lòng thử lại!");
        }
    };

    // Xóa giảng viên khỏi danh sách đã chọn
    const handleDeleteEditTeacher = (teacherId) => {
        setEditSelectedTeachers((prev) => prev.filter((id) => id !== teacherId));
    };

    const handleOpenEditLesson = (lesson) => {
        setEditLesson(lesson);
        // setEditSelectedTeachers(lesson.giangViens);
        setEditSelectedTeachers(lesson.giangViens.map(gv => gv.maGv));

        console.log(lesson)
        setOpenEditLesson(true);
    };

    const handleCloseEditLesson = () => {
        setEditLesson([]);
        setEditSelectedTeachers([]);
        fetchPrograms();
        setOpenEditLesson(false);
    };

    const handleEditLesson = async () => {

        if (!editLesson?.tenBai?.trim()) {
            toast.warning("Vui lòng nhập tên bài học");
            return;
        }

        if (!editLesson?.soTiet || isNaN(editLesson.soTiet) || Number(editLesson.soTiet) <= 0) {
            toast.warning("Vui lòng nhập số tiết hợp lệ");
            return;
        }

        if (!editSelectedTeachers || editSelectedTeachers.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một giảng viên");
            return;
        }

        const updatedLesson = {
            tenBai: editLesson.tenBai,
            soTiet: editLesson.soTiet,
            giangViens: teachers.filter(teacher => editSelectedTeachers.includes(teacher.maGv))
        };

        console.log(updatedLesson)
        try {
            await updateLesson(editLesson.maBai, updatedLesson);
            setLessons(lessons.map(lesson =>
                lesson.maBai === editLesson.maBai ? { ...lesson, tenBai: editLesson.tenBai, soTiet: editLesson.soTiet, giangViens: teachers.filter(teacher => editSelectedTeachers.includes(teacher.maGv)) } : lesson
            )); // Cập nhật trực tiếp danh sách phần học

            toast.success("Cập nhật bài học thành công");
            handleCloseEditLesson();  // Đóng dialog sau khi sửa
        } catch (error) {
            console.error("Lỗi khi sửa bài học:", error);
            // const errMsg = error?.message || "Cập nhật bài học thất bại. Vui lòng thử lại!";
            toast.error("Cập nhật bài học thất bại. Vui lòng thử lại!");
        }
    };


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom >
                Quản Lý Chương Trình Đào Tạo
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleOpenAddProgram}>Thêm CTDT</Button>
                </Box>
                <TableContainer component={Paper} fullWidth>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>Mã CTDT</b></TableCell>
                                <TableCell align="center"><b>Tên CTDT</b></TableCell>
                                <TableCell align="center"><b>Mô tả</b></TableCell>
                                <TableCell align="center"><b>Hành động</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {programs.map((program) => (
                                <TableRow key={program.maCtdt}>
                                    <TableCell align="center">{program.maCtdt}</TableCell>
                                    <TableCell align="center">{program.tenCtdt}</TableCell>
                                    <TableCell align="center">{program.moTa}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={() => handleOpenSections(program)}>Chi tiết phần học</Button>
                                        <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleOpenEditProgram(program)}>Sửa CTDT</Button>
                                        <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(program.maCtdt, "program")}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog danh sách phần học */}
                <Dialog open={openSections} onClose={() => setOpenSections(false)} fullWidth maxWidth="md" >
                    <DialogTitle>Danh sách phần học</DialogTitle>
                    <DialogContent>
                        <DialogActions sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleOpenAddPart}>Thêm phần</Button>
                        </DialogActions>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><b>Mã phần</b></TableCell>
                                        <TableCell align="center"><b>Tên phần</b></TableCell>
                                        <TableCell align="center"><b>Hành động</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sections.map((section) => (
                                        <TableRow key={section.maPhan}>
                                            <TableCell align="center">{section.maPhan}</TableCell>
                                            <TableCell align="center">{section.tenPhan}</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={() => handleOpenLessons(section)}>Chi tiết bài học</Button>
                                                <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleOpenEditPart(section)}>Sửa</Button>
                                                <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(section.maPhan, "part")}>Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenSections(false)} color="secondary">Đóng</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog danh sách bài học */}
                <Dialog open={openLessons} onClose={() => setOpenLessons(false)} fullWidth
                    PaperProps={{
                        sx: {
                            width: "1100px",     // 👈 chỉnh theo ý muốn
                            maxWidth: "95%",     // 👈 để đảm bảo responsive trên màn nhỏ
                        },
                    }}
                >
                    <DialogTitle>Danh sách bài học</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleOpenAddLesson}>Thêm bài</Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><b>Mã bài</b></TableCell>
                                        <TableCell align="center"><b>Tên bài</b></TableCell>
                                        <TableCell align="center"><b>Số tiết</b></TableCell>
                                        <TableCell align="center"><b>Hành động</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lessons.map((lesson) => (
                                        <TableRow key={lesson.maBai}>
                                            <TableCell align="center">{lesson.maBai}</TableCell>
                                            <TableCell align="center">{lesson.tenBai}</TableCell>
                                            <TableCell align="center">{lesson.soTiet}</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleOpenEditLesson(lesson)}>Sửa</Button>
                                                <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleOpenDeleteConfirm(lesson.maBai, "lesson")} >Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenLessons(false)} color="secondary">Đóng</Button>
                    </DialogActions>
                </Dialog>


                {/* Dialog thêm chương trình đào tạo */}
                <Dialog open={openAddProgram} onClose={handleCloseAddProgram} fullWidth maxWidth="sm">
                    <DialogTitle>Thêm chương trình đào tạo</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên CTDT"
                            variant="outlined"
                            fullWidth
                            value={programName}
                            onChange={(e) => setProgramName(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <TextField
                            label="Mô tả CTDT"
                            variant="outlined"
                            fullWidth
                            value={programDescription}
                            onChange={(e) => setProgramDescription(e.target.value)}
                            sx={{ mb: 2 }}
                            multiline
                            rows={4}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddProgram} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddProgram} color="primary">Thêm</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog sửa chương trình đào tạo */}
                <Dialog open={openEditProgram} onClose={handleCloseEditProgram} fullWidth maxWidth="sm">
                    <DialogTitle>Sửa chương trình đào tạo</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên CTDT"
                            variant="outlined"
                            fullWidth
                            value={editProgram.tenCtdt}
                            // onChange={(e) => setEditProgramName(e.target.value)}
                            onChange={(e) => setEditProgram({
                                ...editProgram, // Keep other properties unchanged
                                tenCtdt: e.target.value, // Update only the `tenCtdt` property
                            })}
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <TextField
                            label="Mô tả CTDT"
                            variant="outlined"
                            fullWidth
                            value={editProgram.moTa}
                            onChange={(e) => setEditProgram({
                                ...editProgram, // Keep other properties unchanged
                                moTa: e.target.value, // Update only the `tenCtdt` property
                            })}
                            sx={{ mb: 2 }}
                            multiline
                            rows={4}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditProgram} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleEditProgram} color="primary">Lưu</Button>
                    </DialogActions>
                </Dialog>


                {
                    deleteType && (<Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {deleteType === "program"
                                    ? "Bạn có chắc chắn muốn xóa chương trình đào tạo này?"
                                    : deleteType === "part"
                                        ? "Bạn có chắc chắn muốn xóa phần học này?"
                                        : deleteType === "lesson"
                                            ? "Bạn có chắc chắn muốn xóa bài học này?"
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

                {/* Dialog thêm phần */}
                <Dialog open={openAddPart} onClose={handleCloseAddPart} fullWidth maxWidth="sm" sx={{ zIndex: 9000 }} >
                    <DialogTitle>Thêm phần</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên phần"
                            variant="outlined"
                            fullWidth
                            value={partName}
                            onChange={(e) => setPartName(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddPart} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddPart} color="primary">Thêm</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog sửa phần */}
                <Dialog open={openEditPart} onClose={handleCloseEditPart} fullWidth maxWidth="sm" sx={{ zIndex: 9000 }} >
                    <DialogTitle>Thêm phần</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên phần"
                            variant="outlined"
                            value={editPart.tenPhan}
                            fullWidth
                            onChange={(e) => setEditPart({ ...editPart, tenPhan: e.target.value })}
                            sx={{ mt: 2, mb: 2 }}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditPart} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleEditPart} color="primary">Lưu</Button>
                    </DialogActions>
                </Dialog>


                {/* Dialog thêm bài */}
                <Dialog open={openAddLesson} onClose={handleCloseAddLesson} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }} >
                    <DialogTitle>Thêm bài</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên bài"
                            variant="outlined"
                            fullWidth
                            value={lessonName}
                            onChange={(e) => setLessonName(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                        />

                        {/* Nhập số tiết (chỉ số nguyên dương) */}
                        <TextField
                            label="Số tiết học"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={lessonHours}
                            // onChange={(e) => setLessonHours(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) { // Chỉ cho phép số nguyên dương
                                    setLessonHours(value);
                                }
                            }}
                            inputProps={{ step: "1", min: 0 }} // Chỉ cho nhập số nguyên >= 0
                        />

                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                            <InputLabel sx={{ background: "white" }}>Chọn giảng viên</InputLabel>
                            <Select
                                multiple
                                value={selectedTeachers}
                                onChange={(e) => setSelectedTeachers(e.target.value)}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((id) => {
                                            const teacher = teachers.find((t) => t.maGv === id);
                                            return (
                                                <Chip
                                                    key={id}
                                                    label={teacher ? teacher.tenGv : "Không xác định"}

                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onDelete={() => {
                                                        handleDeleteTeacher(id)
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
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.maGv} value={teacher.maGv}>
                                        {teacher.tenGv}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddLesson} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleAddLesson} color="primary">Thêm</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog sửa bài */}
                <Dialog open={openEditLesson} onClose={handleCloseEditLesson} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }} >
                    <DialogTitle>Sửa bài</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên bài"
                            variant="outlined"
                            fullWidth
                            value={editLesson.tenBai}
                            onChange={(e) => setEditLesson({
                                ...editLesson,
                                tenBai: e.target.value,
                            })}
                            sx={{ mt: 2, mb: 2 }}
                        />

                        <TextField
                            label="Số tiết học"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={editLesson.soTiet}
                            onChange={(e) => setEditLesson({
                                ...editLesson,
                                soTiet: e.target.value,
                            })}
                            inputProps={{ step: "1", min: 0 }} // Chỉ cho nhập số nguyên >= 0
                        />

                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                            <InputLabel sx={{ background: "white" }}>Chọn giảng viên</InputLabel>
                            <Select
                                multiple
                                value={editSelectedTeachers || []}
                                onChange={(e) => setEditSelectedTeachers(e.target.value)}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((id) => {
                                            const teacher = teachers.find((t) => t.maGv === Number(id));
                                            return (
                                                <Chip
                                                    key={id}
                                                    label={teacher ? teacher.tenGv : "Không xác định"}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onDelete={() => {
                                                        handleDeleteEditTeacher(id)
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
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.maGv} value={teacher.maGv}>
                                        {teacher.tenGv}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditLesson} color="secondary">Hủy</Button>
                        <Button variant="contained" onClick={handleEditLesson} color="primary">Lưu</Button>
                    </DialogActions>
                </Dialog>
            </Box >
        </Container>
    );
};

export default ProgramManagement;
