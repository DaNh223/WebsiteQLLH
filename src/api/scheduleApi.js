const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchSchedules = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Schedule`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch học:", error);
        throw error;
    }
};


export const addSchedule = async (scheduleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Schedule/addSchedule`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm lịch học");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};

export const updateSchedule = async (scheduleId, updatedData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Schedule/${scheduleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            // throw new Error("Lỗi khi cập nhật lịch học!");
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi cập nhật lịch học");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật lịch học:", error);
        throw error;
    }

};

export const deleteSchedule = async (scheduleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Schedule/${scheduleId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            // throw new Error("Lỗi khi cập nhật lịch học!");
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi xóa lịch học");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi xóa lịch học:", error);
        throw error;
    }

};

export const moveSchedule = async (moveData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Schedule/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(moveData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi dời lịch học");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi dời lịch học:", error);
        throw error;
    }
};

export const exportSchedule = async (payload) => {
    try {
        console.log("Payload gửi lên API:", JSON.stringify(payload, null, 2));

        const response = await fetch(`${API_BASE_URL}/api/Schedule/export`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "ThoiKhoaBieu.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            console.error("Lỗi khi tải file.");
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
};


