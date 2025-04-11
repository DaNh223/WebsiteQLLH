const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const login = async (data) => {
    const response = await fetch(`${API_BASE_URL}/Account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi đăng nhập');
    }

    return response.json();
};