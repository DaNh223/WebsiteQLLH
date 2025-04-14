import { useState } from "react";
import {
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, IconButton, CssBaseline, Tooltip, Button
} from "@mui/material";
import {
    Menu as MenuIcon, CalendarMonth as ScheduleIcon, ChevronLeft as ChevronLeftIcon,
    AccessTime as AccessTimeIcon, Topic, Ballot, ExitToApp, Groups
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const drawerWidth = 270;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? `${drawerWidth}px` : "60px",
    padding: theme.spacing(3),
}));

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: open ? `${drawerWidth}px` : "60px",
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
        width: open ? `${drawerWidth}px` : "60px",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
        backgroundColor: "#fff",
        color: "#1976D2",
    },
}));

export default function SidebarLayout() {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate(); // Hook dùng để chuyển hướng
    const toggleDrawer = () => setOpen(!open);

    const menuItems = [
        { text: "Quản lý CTDT", icon: <Topic />, path: "/" },
        { text: "Quản lý khóa học", icon: <Ballot />, path: "/course" },
        { text: "Quản lý tổ chức & nhân sự", icon: <Groups />, path: "/org" },
        { text: "Quản lý lịch dạy", icon: <ScheduleIcon />, path: "/schedule" },
        { text: "Quản lý giờ chuẩn", icon: <AccessTimeIcon />, path: "/time" },
    ];


    const handleLogout = () => {
        // Xoá thông tin người dùng khỏi localStorage (hoặc sessionStorage)
        localStorage.removeItem('user');
        // Chuyển hướng về trang login
        navigate("/login");
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton onClick={toggleDrawer} color="inherit" edge="start">
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    WEBSITE QUẢN LÝ LỊCH DẠY VÀ GIỜ CHUẨN
                </Toolbar>
            </AppBar>

            <DrawerStyled variant="permanent" open={open} sx={{ zIndex: 1 }}>
                <Toolbar />
                <List>
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={index} disablePadding sx={{ display: "block" }}>
                                <Tooltip title={!open ? item.text : ""} placement="right">
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            justifyContent: open ? "initial" : "center",
                                            px: 2.5,
                                            color: isActive ? "#fff" : "#1976D2",
                                            backgroundColor: isActive ? "#1976D2" : "transparent",
                                            pointerEvents: isActive ? "none" : "auto",
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: "#1976D2",
                                                color: "#fff",
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : "auto",
                                                justifyContent: "center",
                                                color: "inherit",
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        )
                    })}
                </List>

                {/* Nút Đăng xuất - Thay đổi icon khi thu nhỏ */}
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                    {open ? (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                            sx={{
                                width: '200px',
                            }}
                        >
                            Đăng xuất
                        </Button>
                    ) : (
                        <Tooltip title="Đăng xuất" placement="right">
                            <IconButton
                                color="error"
                                onClick={handleLogout}
                                sx={{
                                    transition: "background-color 0.3s, color 0.3s",
                                    "&:hover": {
                                        backgroundColor: "red", // Chuyển nền đỏ khi hover
                                        color: "white", // Chuyển màu icon thành trắng khi hover
                                    }
                                }}
                            >
                                <ExitToApp />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </DrawerStyled>

            <Main open={open}>
                <Toolbar />
                <Outlet />
            </Main>
        </>
    );
}
