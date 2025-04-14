const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllDepartment = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn vị:", error);
        throw error;
    }
};


export const addDepartment = async (departmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(departmentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm đơn vị");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(departmentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi sửa đơn vị");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi xóa đơn vị");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};

export const addTeacher = async (departmentId, teacherData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department/teacher/${departmentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teacherData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm giảng viên");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department/teacher/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teacherData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi sửa giảng viên");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const deleteTeacher = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Department/teacher/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi xóa giảng viên");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};
