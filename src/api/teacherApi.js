const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllTeachers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Teacher`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)

        return data;

    } catch (error) {
        console.error("Lỗi khi lấy danh sách giảng viên:", error);
        throw error;
    }
};
