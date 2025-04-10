const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllCourses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        throw error;
    }
};


export const addCourse = async (courseData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm khóa học");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const updateCourse = async (id, courseData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi sửa khóa học");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const deleteCourse = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi xóa khóa học");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};

export const addClass = async (courseId, classData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course/class/${courseId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(classData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm lớp học");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};

export const updateClass = async (id, classData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course/class/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(classData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi sửa lớp học");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};


export const deleteClass = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Course/class/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi xóa lớp học");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error.message);
        throw error;
    }
};
