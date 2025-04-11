import { Navigate } from 'react-router-dom';

// Component bảo vệ route, chuyển hướng về trang login nếu người dùng chưa đăng nhập
const ProtectedRoute = ({ children }) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const isAuthenticated = localStorage.getItem('user'); // Kiểm tra trong localStorage

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
