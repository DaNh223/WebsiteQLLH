import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box, TextField
} from "@mui/material";
import dayjs from "dayjs";

import { getAllCourses } from "../api/courseApi"; // Gọi API
import { getAllTeachers } from "../api/teacherApi"; // Gọi API
import { getAllProgramsWithHours } from "../api/programApi"; // Gọi API
import { fetchSchedules, addSchedule, updateSchedule, deleteSchedule, moveSchedule, exportSchedule } from "../api/scheduleApi";
import { toast } from 'react-toastify';
const Schedule = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [weeks, setWeeks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedSession, setSelectedSession] = useState("Sáng");
    // const [teacher, setTeacher] = useState("");
    const [lesson, setLesson] = useState("");
    const [selectedPart, setSelectedPart] = useState("");
    const [schedule, setSchedule] = useState({});
    const [courseData, setCourseData] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [parts, setParts] = useState([]);

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);


    const [editScheduleId, setEditScheduleId] = useState(null);
    const [editSelectedDay, setEditSelectedDay] = useState("");
    const [editSelectedSession, setEditSelectedSession] = useState("");
    const [editSelectedPart, setEditSelectedPart] = useState("");
    const [editLesson, setEditLesson] = useState("");

    const [moveFromDate, setMoveFromDate] = useState("");
    const [moveToDate, setMoveToDate] = useState("");
    const [moveFromSession, setMoveFromSession] = useState("");
    const [moveToSession, setMoveToSession] = useState("");

    const [selectedActivity, setSelectedActivity] = useState(""); // Hoạt động
    const [selectedTeacher, setSelectedTeacher] = useState(""); // Giảng viên
    const [activityHours, setActivityHours] = useState(""); // Số tiết
    const [editSelectedActivity, setEditSelectedActivity] = useState(""); // Hoạt động
    const [editSelectedTeacher, setEditSelectedTeacher] = useState(""); // Giảng viên
    const [editActivityHours, setEditActivityHours] = useState(""); // Số tiết

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedDay("");
        setSelectedSession("");
        setSelectedPart("");
        setLesson("");
        setSelectedActivity("")
        setActivityHours("")
        setSelectedTeacher("")
    };

    const handleOpenConfirmModal = () => {
        if (!selectedCourse || !selectedWeek) {
            // alert("Vui lòng chọn Khóa, Tuần trước khi in!");
            toast.error("Vui lòng chọn Khóa, Tuần trước khi in!")
            return;
        }
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditLesson("");
        setEditSelectedDay("");
        setEditSelectedPart("");
        setEditSelectedSession("");
        setEditScheduleId(null);
        setEditActivityHours("");
        setEditSelectedActivity("");
        setEditSelectedTeacher("");
    };

    const handleOpenMoveModal = () => {
        setOpenMoveModal(true);
    };


    const handleCloseMoveModal = () => {
        setOpenMoveModal(false);
        setMoveFromDate("");
        setMoveToDate("");
        setMoveFromSession("");
        setMoveToSession("");
    };

    const handleConfirmPrint = () => {
        setOpenConfirmModal(false);
        handlePrintSchedule();
    };


    // const getSchedule = async () => {
    //     const data = await fetchSchedules();
    //     const formattedData = data.reduce((acc, item) => {
    //         const { maLichHoc, tenKhoaHoc, tenLop, ngayHoc, buoiHoc,
    //             tenPhan, tenBai, tenGv, diaDiem, hoatDong, tenGvHd, soTietPhanBo, maGv, maGvHd, maBai, maPhan } = item;
    //         const weekLabel = `Tuần ${Math.ceil((new Date(ngayHoc) - new Date(item.ngayBatDau)) / (1000 * 60 * 60 * 24 * 7))}`;
    //         const entry = {
    //             id: maLichHoc, date: ngayHoc, session: buoiHoc, partId: maPhan, part: tenPhan,
    //             teacherId: maGv, teacher: tenGv, lessonId: maBai, lesson: tenBai, lesson_teacher: { maBai: maBai, maGv: maGv }, place: diaDiem, activity: hoatDong, activityTeacherId: maGvHd, activityTeacher: tenGvHd, hours: soTietPhanBo
    //         };

    //         acc[tenKhoaHoc] = acc[tenKhoaHoc] || {};
    //         acc[tenKhoaHoc][tenLop] = acc[tenKhoaHoc][tenLop] || {};
    //         acc[tenKhoaHoc][tenLop][weekLabel] = acc[tenKhoaHoc][tenLop][weekLabel] || [];
    //         acc[tenKhoaHoc][tenLop][weekLabel].push(entry);

    //         return acc;
    //     }, {});

    //     setSchedule(formattedData);
    //     console.log(data)
    // };

    const getSchedule = async () => {
        const data = await fetchSchedules();
        const formattedData = data.reduce((acc, item) => {
            const { maLichHoc, tenKhoaHoc, tenLop, ngayHoc, buoiHoc,
                tenPhan, tenBai, tenGv, diaDiem, hoatDong, tenGvHd, soTietPhanBo, maGv, maGvHd, maBai, maPhan, ngayBatDau } = item;

            // Tính tuần giống với generateWeeks()
            const startDate = dayjs(ngayBatDau);
            const currentDate = dayjs(ngayHoc);
            // Đảm bảo tuần bắt đầu từ thứ 2
            const firstMonday = startDate.day() === 1 ? startDate : startDate.subtract(startDate.day() - 1, "day");
            const diffInWeeks = currentDate.diff(firstMonday, 'week') + 1;
            const weekLabel = `Tuần ${diffInWeeks}`;

            const entry = {
                id: maLichHoc, date: ngayHoc, session: buoiHoc, partId: maPhan, part: tenPhan,
                teacherId: maGv, teacher: tenGv, lessonId: maBai, lesson: tenBai,
                lesson_teacher: { maBai: maBai, maGv: maGv }, place: diaDiem,
                activity: hoatDong, activityTeacherId: maGvHd, activityTeacher: tenGvHd,
                hours: soTietPhanBo
            };

            acc[tenKhoaHoc] = acc[tenKhoaHoc] || {};
            acc[tenKhoaHoc][tenLop] = acc[tenKhoaHoc][tenLop] || {};
            acc[tenKhoaHoc][tenLop][weekLabel] = acc[tenKhoaHoc][tenLop][weekLabel] || [];
            acc[tenKhoaHoc][tenLop][weekLabel].push(entry);

            return acc;
        }, {});

        setSchedule(formattedData);
    };

    useEffect(() => {
        getSchedule();
    }, []);


    const fetchPrograms = async () => {
        try {
            const apiData = await getAllProgramsWithHours();
            const formattedData = apiData.map(program => ({
                id: program.maCtdt,
                name: program.tenCtdt,
                parts: program.phanHocs.map(part => ({
                    id: part.maPhan,
                    name: part.tenPhan,
                    lessons: part.baiHocs.flatMap(lesson =>
                        lesson.giangViens.length > 0
                            ? lesson.giangViens.map(gv => ({
                                // id: `${lesson.maBai}-${gv.maGv}`, // Định danh riêng từng bài học - giảng viên
                                id: { maBai: lesson.maBai, maGv: gv.maGv },
                                name: `${lesson.tenBai} - ${gv.tenGv}`,
                                lessonId: lesson.maBai,
                                teacherId: gv.maGv,
                                teacherName: gv.tenGv,
                                teachers: lesson.giangViens, // Danh sách giảng viên có thể chọn
                                soTiet: lesson.soTiet,
                                soTietDaDayTheoLop: lesson.soTietDaDayTheoLop || []
                            }))
                            : [{
                                id: `${lesson.maBai}-no-teacher`,
                                name: `${lesson.tenBai} - Chưa có giảng viên`,
                                lessonId: lesson.maBai,
                                teacherId: null,
                                teacherName: "Chưa có giảng viên",
                                teachers: lesson.giangViens, // Danh sách giảng viên có thể chọn
                                soTiet: lesson.soTiet,
                                soTietDaDayTheoLop: lesson.soTietDaDayTheoLop || []
                            }]
                    ),
                })),
            }));
            console.log("program", formattedData);
            setPrograms(formattedData);
        } catch (error) {
            console.error("Lỗi khi tải chương trình đào tạo:", error);
        }
    };


    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchCourses = async () => {
        try {
            const apiData = await getAllCourses(); // Gọi API lấy dữ liệu
            const formattedData = apiData.map(course => ({
                id: course.maKhoaHoc, // Lưu ID khóa học
                name: course.tenKhoaHoc,
                classes: course.lopHocs.map(lop => ({
                    id: lop.maLop,
                    name: lop.tenLop,
                    place: lop.diaDiem
                })),
                startDate: course.ngayBatDau,
                endDate: course.ngayKetThuc,
                program: course.maCtdt
            }));

            setCourseData(formattedData);
        } catch (error) {
            console.error("Không thể tải dữ liệu khóa học", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);



    const fetchTeachers = async () => {
        try {
            const apiData = await getAllTeachers();
            const formattedData = apiData.map(teacher => ({
                id: teacher.maGv, // Lưu ID khóa học
                name: teacher.tenGv,
            }));
            setTeachers(formattedData);
        } catch (error) {
            console.error("Lỗi khi tải giáo viên đào tạo:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const generateWeeks = (startDate, endDate) => {
        let start = dayjs(startDate);
        let end = dayjs(endDate);

        // Đảm bảo tuần bắt đầu vào thứ 2
        let firstMonday = start.day() === 1 ? start : start.subtract(start.day() - 1, "day"); // Lấy thứ 2 của tuần hiện tại


        let weekList = [];
        let currentWeekStart = firstMonday;

        while (currentWeekStart.isBefore(end) || currentWeekStart.isSame(end, "day")) {
            let weekDays = [];
            for (let j = 0; j < 7; j++) {
                let day = currentWeekStart.add(j, "day");
                if (day.isAfter(end)) break; // Dừng nếu vượt quá ngày kết thúc
                weekDays.push({ label: `Thứ ${j + 2} (${day.format("DD/MM")})`, date: day });
            }
            weekList.push({
                label: `Tuần ${weekList.length + 1}`,
                startDate: currentWeekStart.format("DD/MM/YYYY"),
                endDate: currentWeekStart.add(6, "day").format("DD/MM/YYYY"),
                days: weekDays
            });

            currentWeekStart = currentWeekStart.add(7, "day"); // Chuyển sang tuần tiếp theo
        }
        return weekList;
    };

    useEffect(() => {
        if (selectedCourse) {
            const course = courseData.find(c => c.id === selectedCourse);
            if (course) {
                setSelectedProgram(course.program); // Lưu mã CTĐT của khóa học
                setWeeks(generateWeeks(course.startDate, course.endDate)); // Tạo tuần học

                // Tìm danh sách các phần học từ danh sách CTĐT
                const program = programs.find(p => p.id === course.program);
                setParts(program ? program.parts : []);
            }
        } else {
            setSelectedProgram("");
            setParts([]);
        }
    }, [selectedCourse, courseData, programs]);

    // useEffect(() => {
    //     setWeeks(generateWeeks(2025));
    // }, []);

    const handleAddSchedule = async () => {
        // Kiểm tra điều kiện cơ bản
        if (!selectedCourse || !selectedClass || !selectedWeek || !selectedDay) {
            // alert("Vui lòng chọn đầy đủ Khóa học, Lớp, Tuần và Ngày!");
            toast.warning("Vui lòng chọn đầy đủ Khóa học, Lớp, Tuần và Ngày!")
            return;
        }

        // Kiểm tra nếu chọn "Phần" mà không có "Bài học"
        if (selectedPart && !lesson) {
            // alert("Vui lòng chọn Bài dạy!");
            toast.warning("Vui lòng chọn Bài dạy!")
            return;
        }

        // Kiểm tra nếu nhập Hoạt động thì phải có đủ cả Giảng viên và Số tiết
        if (selectedActivity || selectedTeacher || activityHours) {
            if (!selectedActivity || !selectedTeacher || !activityHours) {
                // alert("Vui lòng nhập đầy đủ Hoạt động, Giảng viên và Số tiết!");
                toast.warning("Vui lòng nhập đầy đủ Hoạt động, Giảng viên và Số tiết!")
                return;
            }

            if (activityHours <= 0) {
                // alert("Vui lòng nhập số tiết lớn hơn 0!");
                toast.warning("Vui lòng nhập số tiết lớn hơn 0!")
                return;
            }
        }
        // Chỉ cho phép chọn một trong hai: Bài học hoặc Hoạt động
        if ((lesson && selectedActivity) || (!lesson && !selectedActivity)) {
            // alert("Vui lòng chọn Bài dạy hoặc nhập Hoạt động, không được chọn cả hai!");
            toast.warning("Vui lòng chọn Bài dạy hoặc nhập Hoạt động, không được chọn cả hai!")

            return;
        }

        // const { maBai, maGv } = lesson.id;
        const formattedDate = selectedDay.split("/").reverse().join("-");

        // // Tạo đối tượng mới cho lịch học
        // const newSchedule = lesson
        //     ? {
        //         ngayHoc: formattedDate,
        //         buoiHoc: selectedSession,
        //         // maBai: lesson.id,
        //         maBai: maBai,
        //         maGv: maGv || null,
        //         maLop: selectedClass,
        //     }
        //     : {
        //         ngayHoc: formattedDate,
        //         buoiHoc: selectedSession,
        //         hoatDong: selectedActivity,
        //         maGv: selectedTeacher,
        //         soTiet: activityHours,
        //         maLop: selectedClass,
        //     };
        let newSchedule;

        if (lesson && lesson.id) {
            const { maBai, maGv } = lesson.id;
            newSchedule = {
                ngayHoc: formattedDate,
                buoiHoc: selectedSession,
                maBai: maBai,
                maGv: maGv || null,
                maLop: selectedClass,
            };
        } else {
            newSchedule = {
                ngayHoc: formattedDate,
                buoiHoc: selectedSession,
                hoatDong: selectedActivity,
                maGv: selectedTeacher,
                soTiet: activityHours,
                maLop: selectedClass,
            };
        }

        try {
            const response = await addSchedule(newSchedule);
            // alert(response.message);
            toast.success(response.message);
        } catch (error) {
            if (error.message) {
                // alert(error.message); // Hiển thị lỗi từ API
                toast.error(error.message); // Hiển thị lỗi từ API
            } else {
                // alert("Lỗi khi thêm lịch học!");
                toast.error("Lỗi khi thêm lịch học!");
            }
        } finally {
            await getSchedule();
            await fetchPrograms();
            handleCloseModal();
        }
    };


    const handleEditSchedule = async () => {
        // Kiểm tra điều kiện cơ bản
        if (!editSelectedDay || !editSelectedSession) {
            // alert("Vui lòng chọn ngày sửa");
            toast.warning("Vui lòng chọn ngày sửa");
            return;
        }

        // Kiểm tra nếu chọn "Phần" mà không có "Bài học"
        if (editSelectedPart && !editLesson) {
            // alert("Vui lòng chọn Bài dạy!");
            toast.warning("Vui lòng chọn Bài dạy!");
            return;
        }

        // Kiểm tra nếu nhập Hoạt động thì phải có đủ cả Giảng viên và Số tiết
        if (editSelectedActivity || editSelectedTeacher || editActivityHours) {
            if (!editSelectedActivity || !editSelectedTeacher || !editActivityHours) {
                // alert("Vui lòng nhập đầy đủ Hoạt động, Giảng viên và Số tiết!");
                toast.warning("Vui lòng nhập đầy đủ Hoạt động, Giảng viên và Số tiết!");
                return;
            }

            if (editActivityHours <= 0) {
                // alert("Vui lòng nhập số tiết lớn hơn 0!");
                toast.warning("Vui lòng nhập số tiết lớn hơn 0!");
                return;
            }
        }

        // Chỉ cho phép chọn một trong hai: Bài học hoặc Hoạt động
        if ((editLesson && editSelectedActivity) || (!editLesson && !editSelectedActivity)) {
            // alert("Vui lòng chọn Bài dạy hoặc nhập Hoạt động, không được chọn cả hai!");
            toast.warning("Vui lòng chọn Bài dạy hoặc nhập Hoạt động, không được chọn cả hai!");
            return;
        }

        // console.log("editLesson", editLesson)
        const { maBai, maGv } = editLesson;

        const updatedSchedule = {
            ngayHoc: editSelectedDay,
            buoiHoc: editSelectedSession,
            maBai: maBai,
            maGv: maGv,
            maLop: selectedClass, // Đảm bảo gửi MaLop
            soTiet: editActivityHours ? editActivityHours : null,
            hoatDong: editSelectedActivity ? editSelectedActivity : null,
        };

        try {
            const response = await updateSchedule(editScheduleId, updatedSchedule);
            // alert(response.message);
            toast.success(response.message);
        } catch (error) {
            if (error.message) {
                // alert(error.message);
                toast.error(error.message);
            } else {
                // alert("Có lỗi xảy ra khi cập nhật lịch học!");
                toast.error("Có lỗi xảy ra khi cập nhật lịch học!");
            }
        }
        finally {
            await getSchedule();
            await fetchPrograms();
            handleCloseEditModal(); // Đóng modal sau khi cập nhật thành công
        }
    };

    const handleDeleteSchedule = async () => {
        try {
            const response = await deleteSchedule(editScheduleId);
            // console.log("Xóa lịch học thành công");
            toast.success(response.message);

        } catch (error) {
            // console.error("Lỗi khi xóa lịch học:", error.message || error);
            if (error.message) {
                // alert(error.message);
                toast.error(error.message);
            } else {
                // alert("Có lỗi xảy ra khi cập nhật lịch học!");
                toast.error("Có lỗi xảy ra khi xóa lịch học!");
            }
        } finally {
            await getSchedule();
            await fetchPrograms();
            setOpenDeleteConfirm(false);
            handleCloseEditModal();
        }
    };

    const handleMoveSchedule = async () => {
        const isFromDayOnly = moveFromDate && !moveFromSession;
        const isToDayOnly = moveToDate && !moveToSession;
        if (!moveFromDate || !moveToDate) {
            // alert("Vui lòng chọn ngày dời và ngày dời đến.");
            toast.warning("Vui lòng chọn ngày dời và ngày dời đến.");
            return;
        }
        // Nếu một bên chỉ chọn buổi, còn bên kia chỉ chọn ngày → Không hợp lệ
        if ((isFromDayOnly && !isToDayOnly) || (!isFromDayOnly && isToDayOnly)) {
            // alert("Vui lòng chọn thông tin chính xác");
            toast.warning("Vui lòng chọn thông tin chính xác");
            return;
        }

        const moveData = {
            moveFromDate,
            moveFromSession: moveFromSession || null, // Nếu không chọn buổi, gửi null
            moveToDate,
            moveToSession: moveToSession || null, // Nếu không chọn buổi, gửi null
            maLop: selectedClass, // Mã lớp học
        };

        try {
            await moveSchedule(moveData);
            // alert("Dời lịch thành công!");
            toast.success("Dời lịch thành công!");
        } catch (error) {
            // alert(error.message || "Có lỗi xảy ra khi dời lịch.");
            toast.error(error.message || "Có lỗi xảy ra khi dời lịch.");
        } finally {
            await getSchedule();
            handleCloseMoveModal(); // Đóng modal sau khi cập nhật thành công
        }
    };


    const handlePrintSchedule = async () => {
        const selectedWeekData = weeks.find(week => week.label === selectedWeek);
        if (!selectedWeekData) return;

        const payload = {
            weekNumber: selectedWeek,
            startDate: selectedWeekData.startDate,
            endDate: selectedWeekData.endDate,
            days: selectedWeekData.days.map(d => d.date.format("YYYY-MM-DD")),
            schedules: schedule,
        };
        try {
            await exportSchedule(payload);
            // alert(response.message);
        } catch (error) {
            if (error.message) {
                toast.error(error.message); // Hiển thị lỗi từ API
                // alert(error.message); // Hiển thị lỗi từ API
            } else {
                // alert("Lỗi khi in lịch học!");
                toast.error("Lỗi khi in lịch học!");
            }
        }
    };

    const handleCellClick = (day, session) => {
        const formattedDate = day.date.format("DD/MM/YYYY");

        // Tìm khóa học và lớp học đang chọn
        const selectedCourseData = courseData.find((c) => c.id === selectedCourse);
        const courseName = selectedCourseData?.name;
        const className = selectedCourseData?.classes.find((cls) => cls.id === selectedClass)?.name;

        if (!courseName || !className) return;

        // Lấy danh sách lịch của tuần hiện tại
        const weekSchedule = schedule[courseName]?.[className]?.[selectedWeek] || [];

        // Tìm lịch đã tồn tại
        const existingEntry = weekSchedule.find(
            (e) => dayjs(e.date).format("DD/MM/YYYY") === formattedDate && e.session === session
        );

        if (existingEntry) {
            setEditScheduleId(existingEntry.id);
            // console.log("ma lich sua:", existingEntry.id);

            // Nếu đã có lịch => mở modal chỉnh sửa
            setEditSelectedDay(formattedDate);
            setEditSelectedSession(existingEntry.session);
            const selectedCourseData = schedule[courseName]?.[className]?.[selectedWeek];

            console.log("selectedCourseData", selectedCourseData);
            if (selectedCourseData) {
                setOpenEditModal(true);


                const foundSchedule = selectedCourseData.find(entry => {
                    const entryDateObj = dayjs(entry.date, "YYYY-MM-DD", true);
                    const entryDate = entryDateObj.format("DD/MM/YYYY");
                    return entryDate === formattedDate && entry.session === session; // Thêm return
                });

                console.log("found schedule: ", foundSchedule);
                if (foundSchedule) {
                    // Tìm phần học theo tên
                    // const foundPart = parts.find((part) => part.name === foundSchedule.part);
                    const foundPart = parts.find((part) => part.id === foundSchedule.partId);
                    console.log("foundPart", foundPart);


                    // const foundActivity = schedule.find((schedule) => schedule.activity === foundSchedule.activity);
                    // const foundTeacher = schedule.find((schedule) => schedule.activityTeacher === foundSchedule.activityTeacher);
                    // const foundHours = schedule.find((schedule) => schedule.hours === foundSchedule.hours);

                    const foundActivity = foundSchedule.activity;
                    const foundTeacher = teachers.find((teacher) => teacher.id === foundSchedule.activityTeacherId);
                    const foundHours = foundSchedule.hours;

                    console.log("foundActivity", foundActivity);
                    console.log("foundTeacher", foundTeacher.id);

                    if (foundPart) {
                        console.log("foundPart", foundPart);
                        setEditSelectedPart(foundPart.id); // Gán ID của phần học

                        const foundLesson = foundPart.lessons.find(
                            (lesson) =>
                                lesson.id.maBai === foundSchedule.lesson_teacher.maBai &&
                                lesson.id.maGv === foundSchedule.lesson_teacher.maGv
                        );
                        console.log("foundSchedule.lesson_teacher", foundSchedule.lesson_teacher);
                        console.log("foundLesson", foundLesson);


                        if (foundLesson) {
                            setEditLesson(foundLesson.id); // Gán ID của bài học
                        } else {
                            setEditLesson(""); // Không tìm thấy bài học thì reset
                        }

                    }
                    else if (foundActivity) {
                        setEditSelectedActivity(foundActivity);

                        if (foundTeacher) {
                            setEditSelectedTeacher(foundTeacher.id);
                        }

                        if (foundHours) {
                            setEditActivityHours(foundHours);
                        }
                    }

                    else {
                        setEditSelectedPart("");
                        setEditLesson("");
                    }
                } else {
                    setEditSelectedPart("");
                    setEditLesson("");
                }
            }


        } else {
            // Nếu chưa có lịch => mở modal thêm mới
            setSelectedDay(formattedDate);
            setSelectedSession(session);
            setOpenModal(true);
        }
    };



    return (
        <Container sx={{ mt: 4 }}>
            {/* <Typography variant="h4" gutterBottom>
                Quản lý lịch dạy
            </Typography> */}


            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý lịch dạy
                </Typography>

                {selectedWeek && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleOpenMoveModal}>
                            Dời lịch
                        </Button>
                        <Button variant="contained" color="success" onClick={handleOpenConfirmModal}>
                            In lịch
                        </Button>
                    </Box>
                )}
            </Box>


            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {/* Dropdown Khóa học */}
                <FormControl fullWidth sx={{ mb: 2 }} ariant="outlined">
                    <InputLabel
                        sx={{ background: "white" }}
                    >
                        Khóa học
                    </InputLabel>
                    <Select
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedClass("");
                            setSelectedWeek("");
                        }}
                    >
                        {courseData.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Dropdown Lớp học */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ background: "white" }}>Lớp học</InputLabel>
                    <Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        disabled={!selectedCourse}
                    >
                        {courseData.find(c => c.id === selectedCourse)?.classes.map(cls => (
                            <MenuItem key={cls.id} value={cls.id}>
                                {cls.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Dropdown Tuần */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ background: "white" }}>Tuần</InputLabel>
                    <Select value={selectedWeek || ""} onChange={(e) => setSelectedWeek(e.target.value)} disabled={!selectedCourse}>
                        {weeks.map((week, index) => (
                            <MenuItem key={index} value={week.label}>
                                {week.label} ({week.startDate} - {week.endDate})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* {selectedWeek && (
                <>
                    <Button variant="contained" color="secondary" sx={{ mr: 2 }} onClick={handleOpenMoveModal}>
                        Dời lịch
                    </Button>
                    <Button variant="contained" color="success" onClick={handleOpenConfirmModal}>
                        In lịch
                    </Button>
                </>
            )} */}

            {selectedCourse &&
                selectedClass &&
                selectedWeek &&
                (
                    <>
                        {/* <Typography variant="h5" sx={{ mt: 2 }}>
                            Thời Khóa Biểu {selectedWeek}
                        </Typography> */}
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Ngày</b>
                                        </TableCell>
                                        {weeks.find((w) => w.label === selectedWeek)?.days.map((day, index) => (
                                            <TableCell key={index} align="center">
                                                <b>{day.label.replace("Thứ 8", "Chủ Nhật")}</b>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {["Sáng", "Chiều"].map((session, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <b>Buổi {session}</b>
                                            </TableCell>
                                            {weeks.find((w) => w.label === selectedWeek)?.days.map((day, index) => {
                                                // Tìm khóa học dựa trên selectedCourse (id)
                                                const selectedCourseData = courseData.find((c) => c.id === selectedCourse);
                                                const courseName = selectedCourseData?.name;
                                                console.log(courseName);

                                                // Tìm lớp học dựa trên selectedClass (id) trong danh sách classes của khóa học
                                                const className = selectedCourseData?.classes.find((cls) => cls.id === selectedClass)?.name;

                                                // Nếu không tìm thấy courseName, className hoặc subjectName, không hiển thị gì cả
                                                if (!courseName || !className
                                                    // || !subjectName
                                                ) return <TableCell key={index} align="center">—</TableCell>;

                                                // Lấy danh sách thời khóa biểu của tuần hiện tại
                                                const weekSchedule = schedule[courseName]?.[className]?.[selectedWeek] || [];

                                                // Tìm entry phù hợp với ngày, session, subjectName
                                                const entry = weekSchedule.find(
                                                    (e) =>
                                                        dayjs(e.date).format("DD/MM/YYYY") === dayjs(day.date).format("DD/MM/YYYY") &&
                                                        e.session === session
                                                    // &&
                                                    // e.subject === subjectName // So sánh với subjectName thay vì ID
                                                );

                                                return (
                                                    <TableCell
                                                        key={index}
                                                        align="center"
                                                        sx={{
                                                            whiteSpace: "pre-line",
                                                            cursor: "pointer",
                                                            transition: "background 0.3s, transform 0.1s",
                                                            "&:hover": {
                                                                backgroundColor: "#2196F3", // Màu xanh dương khi hover
                                                                color: "white", // Đổi màu chữ để dễ nhìn hơn
                                                            },
                                                            "&:active": {
                                                                backgroundColor: "#1976D2", // Màu xanh đậm hơn khi nhấn
                                                                transform: "scale(0.95)", // Hiệu ứng ấn xuống
                                                            },
                                                        }}
                                                        onClick={() => handleCellClick(day, session)}
                                                    >
                                                        {/*     {entry ? `${entry.part} - ${entry.lesson} \n(${entry.teacher}) \n${entry.place}` : "—"}
                                                    */}
                                                        {entry
                                                            ? entry.part || entry.lesson
                                                                ? `${entry.part || ""} ${entry.lesson ? `- ${entry.lesson}` : ""} \n(${entry.teacher}) \n${entry.place}`
                                                                : `${entry.activity} \n(${entry.activityTeacher})` // Nếu không có phần và bài, hiển thị hoạt động
                                                            : "—"}

                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

            <Dialog
                open={openModal}
                onClose={handleCloseModal} sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",  // Đặt chiều rộng cố định
                        maxWidth: "500px", // Giới hạn chiều rộng tối đa
                        height: "auto", // Chiều cao tự động dựa theo nội dung
                    },
                }}>
                {/* <DialogTitle>Thêm lịch học</DialogTitle> */}
                <DialogContent>

                    {/* Hiển thị ngày và buổi được chọn */}
                    <DialogTitle align="center" sx={{ fontWeight: "bold", mb: 2 }}>
                        {selectedDay ? `Thêm lịch ngày ${selectedDay} - Buổi ${selectedSession}` : "Chọn ngày và buổi"}
                    </DialogTitle>

                    <Typography align="center" mb={2}>Chọn bài dạy</Typography>
                    {/* Dropdown Phần */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Phần</InputLabel>
                        <Select
                            value={selectedPart || ""}
                            onChange={(e) => {
                                setSelectedPart(e.target.value);
                                setLesson(""); // Reset bài học khi đổi phần
                            }}
                            disabled={!selectedProgram}
                        // disabled={!selectedProgram || !!selectedActivity}

                        >
                            {parts.map((part) => {
                                // 🔹 Kiểm tra nếu tất cả bài học trong phần của lớp đó đã đủ số tiết
                                const allLessonsFullForClass = part.lessons.every(l => {
                                    const classLessonData = l.soTietDaDayTheoLop.find(st => st.maLop === selectedClass);
                                    return (classLessonData?.soTietDaDay || 0) >= l.soTiet; // Nếu tất cả bài đủ số tiết thì vô hiệu hóa
                                });

                                return (
                                    <MenuItem key={part.id} value={part.id} disabled={allLessonsFullForClass}>
                                        {part.name} {allLessonsFullForClass ? "(Đủ số tiết)" : ""}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Bài dạy</InputLabel>
                        <Select
                            value={lesson?.id || ""}
                            onChange={(e) => {
                                const selectedLesson = parts
                                    .find((p) => p.id === selectedPart)
                                    ?.lessons.find((l) => l.id === e.target.value);
                                setLesson(selectedLesson);
                                setSelectedActivity("");
                                setActivityHours("");
                            }}
                        >
                            {selectedPart &&
                                (() => {
                                    const lessons = parts.find((p) => p.id === selectedPart)?.lessons || [];

                                    return lessons.map((l, index) => {
                                        const classLessonData = l.soTietDaDayTheoLop.find(st => st.maLop === selectedClass);
                                        const soTietDaDay = classLessonData?.soTietDaDay || 0;
                                        const isLessonFull = soTietDaDay >= l.soTiet;

                                        return (
                                            <MenuItem key={index} value={l.id} disabled={isLessonFull}>
                                                {l.name} {isLessonFull ? "(Đủ số tiết)" : ""}
                                            </MenuItem>
                                        );
                                    });
                                })()
                            }
                        </Select>
                    </FormControl>



                    <Typography align="center" mb={2}>Hoặc</Typography>

                    {/* Nhập Hoạt động */}
                    <TextField
                        label="Hoạt động"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={selectedActivity}
                        onChange={(e) => {
                            setSelectedActivity(e.target.value);
                            // Xóa bài học khi nhập hoạt động
                            setLesson(null);
                            setSelectedPart("");
                        }}
                    />

                    {/* Chọn Giảng viên cho Hoạt động */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Giảng viên</InputLabel>
                        <Select
                            value={selectedTeacher || ""}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    {/* Nhập Số tiết cho Hoạt động */}
                    <TextField
                        label="Số tiết"
                        type="number"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={activityHours}
                        onChange={(e) => setActivityHours(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddSchedule} variant="contained" color="primary">
                        Lưu lịch
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openEditModal} onClose={handleCloseEditModal}
                sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",  // Đặt chiều rộng cố định
                        maxWidth: "500px", // Giới hạn chiều rộng tối đa
                        height: "auto", // Chiều cao tự động dựa theo nội dung
                    },
                }}
            >
                <DialogTitle align="center" sx={{ fontWeight: "bold", mb: 2 }}>
                    {editSelectedDay ? `Sửa lịch ngày ${editSelectedDay} - Buổi ${editSelectedSession}` : "Chọn ngày và buổi"}
                </DialogTitle>
                <DialogContent>
                    <Typography align="center" mb={2}>Chọn bài dạy</Typography>
                    {/* Dropdown Phần */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Phần</InputLabel>
                        <Select value={editSelectedPart} onChange={(e) => setEditSelectedPart(e.target.value)}>
                            {parts.map((part) => {
                                // 🔹 Kiểm tra nếu tất cả bài học trong phần của lớp đó đã đủ số tiết
                                const allLessonsFullForClass = part.lessons.every(l => {
                                    const classLessonData = l.soTietDaDayTheoLop.find(st => st.maLop === selectedClass);
                                    return (classLessonData?.soTietDaDay || 0) >= l.soTiet; // Nếu tất cả bài đủ số tiết thì vô hiệu hóa
                                });

                                return (
                                    <MenuItem key={part.id} value={part.id} disabled={allLessonsFullForClass}>
                                        {part.name} {allLessonsFullForClass ? "(Đủ số tiết)" : ""}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Bài dạy</InputLabel>
                        <Select
                            value={editLesson}
                            onChange={(e) => {
                                setEditLesson(e.target.value);
                                // Xóa hoạt động khi chọn bài học
                                setEditSelectedActivity("");
                                setEditSelectedTeacher("");
                                setEditActivityHours("");
                            }}
                        >
                            {editSelectedPart &&
                                parts.find((p) => p.id === editSelectedPart)
                                    ?.lessons.map((l, index) => {
                                        const selectedCourseData = courseData.find((c) => c.id === selectedCourse);
                                        const className = selectedCourseData?.classes.find((cls) => cls.id === selectedClass)?.name;

                                        if (!className) return null; // Không có lớp thì không hiển thị

                                        // 🔹 Lấy số tiết đã dạy của bài đó cho lớp đang chọn
                                        const classLessonData = l.soTietDaDayTheoLop.find(st => st.maLop === selectedClass);
                                        const soTietDaDay = classLessonData?.soTietDaDay || 0;
                                        const isLessonFull = soTietDaDay >= l.soTiet;

                                        // 🔹 Kiểm tra nếu bài đang chọn có cùng maBai, thì không disable
                                        const isSameLesson = editLesson && editLesson.maBai === l.id.maBai;
                                        const shouldDisable = isLessonFull && !isSameLesson;

                                        return (
                                            <MenuItem key={index} value={l.id} disabled={shouldDisable}>
                                                {l.name} {shouldDisable ? "(Đủ số tiết)" : ""}
                                            </MenuItem>
                                        );
                                    })}
                        </Select>
                    </FormControl>

                    <Typography align="center" mb={2}>Hoặc</Typography>

                    {/* Nhập Hoạt động */}
                    {/* <TextField
                        label="Hoạt động"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={editSelectedActivity}
                        onChange={(e) => {
                            setEditSelectedActivity(e.target.value);
                            setEditLesson(null);
                            setEditSelectedPart("");
                        }}
                    /> */}
                    <TextField
                        label="Hoạt động"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={editSelectedActivity ?? ""} // Nếu undefined, dùng ""
                        onChange={(e) => {
                            setEditSelectedActivity(e.target.value);
                            setEditLesson("");
                            setEditSelectedPart("");
                        }}
                    />


                    {/* Chọn Giảng viên cho Hoạt động */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Giảng viên</InputLabel>
                        <Select
                            value={editSelectedTeacher || null}
                            onChange={(e) => setEditSelectedTeacher(e.target.value)}
                        // disabled={!selectedActivity} // Chỉ chọn khi có hoạt động
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    {/* Nhập Số tiết cho Hoạt động */}
                    <TextField
                        label="Số tiết"
                        type="number"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={editActivityHours ?? null}
                        onChange={(e) => setEditActivityHours(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={() => setOpenDeleteConfirm(true)} variant="contained" color="error">
                        Xóa lịch
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleEditSchedule}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openMoveModal} onClose={handleCloseMoveModal}
                sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",  // Đặt chiều rộng cố định
                        maxWidth: "500px", // Giới hạn chiều rộng tối đa
                        height: "auto", // Chiều cao tự động dựa theo nội dung
                    },
                }}
            >
                <DialogTitle>Dời lịch học</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Chọn ngày</InputLabel>
                        <Select value={moveFromDate} onChange={(e) => setMoveFromDate(e.target.value)}>
                            {/* {weeks.find((w) => w.label === selectedWeek)?.days.map((day, index) => (
                                <MenuItem key={index} value={day.date.format("DD/MM/YYYY")}>
                                    {day.label.replace("Thứ 8", "Chủ Nhật")}
                                </MenuItem>
                            ))} */}
                            {weeks.flatMap((week, weekIndex) =>
                                [
                                    <MenuItem key={`week-${weekIndex}`} disabled sx={{ fontWeight: "bold" }}>
                                        {week.label}
                                    </MenuItem>,
                                    ...week.days.map((day, dayIndex) => (
                                        <MenuItem key={`${weekIndex}-${dayIndex}`} value={day.date.format("DD/MM/YYYY")}>
                                            {day.label.replace("Thứ 8", "Chủ Nhật")}
                                        </MenuItem>
                                    ))
                                ]
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Buổi</InputLabel>
                        <Select value={moveFromSession} onChange={(e) => setMoveFromSession(e.target.value)}>
                            {["Sáng", "Chiều"].map((session, index) => (
                                <MenuItem key={index} value={session}>{session}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Ngày dời đến</InputLabel>
                        <Select value={moveToDate} onChange={(e) => setMoveToDate(e.target.value)}>
                            {weeks.flatMap((week, weekIndex) =>
                                [
                                    <MenuItem key={`week-${weekIndex}`} disabled sx={{ fontWeight: "bold" }}>
                                        {week.label}
                                    </MenuItem>,
                                    ...week.days.map((day, dayIndex) => (
                                        <MenuItem key={`${weekIndex}-${dayIndex}`} value={day.date.format("DD/MM/YYYY")}>
                                            {day.label.replace("Thứ 8", "Chủ Nhật")}
                                        </MenuItem>
                                    ))
                                ]
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ background: "white" }}>Buổi dời đến</InputLabel>
                        <Select value={moveToSession} onChange={(e) => setMoveToSession(e.target.value)}>
                            {["Sáng", "Chiều"].map((session, index) => (
                                <MenuItem key={index} value={session}>{session}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMoveModal} color="secondary">
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleMoveSchedule}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
                <DialogTitle>Xác nhận in lịch</DialogTitle>
                <DialogContent>
                    <Typography>
                        In lịch
                        từ ngày <b> {weeks.find(w => w.label === selectedWeek)?.startDate} </b>
                        đến ngày <b> {weeks.find(w => w.label === selectedWeek)?.endDate} </b>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmPrint} variant="contained" color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa lịch này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteSchedule} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>



        </Container>
    );
};
export default Schedule;
