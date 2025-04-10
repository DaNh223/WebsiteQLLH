const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllParts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Part`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phần học:", error);
        throw error;
    }
};
