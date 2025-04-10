const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchDepartment = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/StandardHours/GetAllDepartment`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khoa:", error);
        throw error;
    }
};

export const fetchAcademicYears = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/StandardHours/GetAcademicYears`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách năm học:", error);
        throw error;
    }
};

export const exportTeachingSchedule = async (maKhoa, selectedMonths) => {
    try {
        const response = await fetch(`${API_BASE_URL}/StandardHours/ExportTeachingSchedule`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ maKhoa, months: selectedMonths }),
        });

        if (!response.ok) {
            throw new Error("Lỗi khi xuất lịch giảng dạy");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi API:", error);
        return null;
    }
};


export const exportDetails = async (year, months) => {
    try {
        const response = await fetch(`${API_BASE_URL}/StandardHours/ExportDetails/${year}?months=${months.join(",")}`, {
            method: "GET",
        });

        // if (!response.ok) throw new Error("Lỗi khi tải file");
        if (!response.ok) {
            // const errorData = await response.json();
            // alert(errorData.message || "Lỗi không xác định!");
            // return;
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi không xác định!");
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `GioGiang_${year}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Lỗi khi xuất file Excel:", error);
        throw error;
    }
};


export const exportSummary = async (year, months) => {
    try {
        const response = await fetch(`${API_BASE_URL}/StandardHours/ExportSummary/${year}?months=${months.join(",")}`, {
            method: "GET",
        });

        // if (!response.ok) throw new Error("Lỗi khi tải file");
        if (!response.ok) {
            // const errorData = await response.json();
            // alert(errorData.message || "Lỗi không xác định!");
            // return;
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi không xác định!");
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `ThongKe_${year}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Lỗi khi xuất file tổng kết:", error);
        throw error;

    }
};



