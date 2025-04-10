const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



export const getAllPrograms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy chương trình đào tạo:", error);
        throw error;
    }
};


export const getAllProgramsWithHours = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/withHours`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy chương trình đào tạo:", error);
        throw error;
    }
};


// Hàm gọi API để thêm chương trình đào tạo
export const addProgram = async (program) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(program),
        });
        if (!response.ok) {
            throw new Error("Lỗi khi thêm chương trình đào tạo");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

// Hàm gọi API để sửa chương trình đào tạo
export const updateProgram = async (programId, updatedProgram) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/${programId}`, {
            method: "PUT",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProgram),
        });
        // if (!response.ok) {
        //     // throw new Error("Lỗi khi cập nhật chương trình đào tạo");
        // }
        // const data = await response.json();
        // return data;
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm phần");
        }
        return await response.json();

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

// Hàm gọi API để sửa chương trình đào tạo
export const deleteProgramFunc = async (programId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/${programId}`, {
            method: "DELETE",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Lỗi khi xóa chương trình đào tạo");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};


export const addPart = async (programId, partdata) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/addPart/${programId}`, {
            method: "POST",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(partdata),
        });
        if (!response.ok) {
            throw new Error("Lỗi khi thêm phần");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};


// Hàm gọi API để sửa chương trình đào tạo
export const updatePart = async (id, updatedPart) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/editPart/${id}`, {
            method: "PUT",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPart),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi thêm phần");
        }
        return await response.json();

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

export const deletePartFunc = async (partid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/part/${partid}`, {
            method: "DELETE",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Lỗi khi xóa phần học");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};


export const addLesson = async (partId, lessonData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/addLesson/${partId}`, {
            method: "POST",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lessonData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            // alert(errorData.message || "Lỗi không xác định!");
            throw new Error(errorData.message || "Lỗi không xác định");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};


export const updateLesson = async (id, dataUpdate) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/editLesson/${id}`, {
            method: "PUT",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataUpdate),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lỗi API:", errorData);
            throw new Error(errorData.message || "Lỗi khi sửa bài");
        }
        return await response.json();

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

export const deleteLessonFunc = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Program/lesson/${id}`, {
            method: "DELETE",  // Sử dụng PUT để cập nhật dữ liệu
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Lỗi khi xóa bài học");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

