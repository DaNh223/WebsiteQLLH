import { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, CssBaseline, Tooltip } from "@mui/material";
import { Menu as MenuIcon, CalendarMonth as ScheduleIcon, ChevronLeft as ChevronLeftIcon, AccessTime as AccessTimeIcon, Topic, Ballot } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: open ? `${drawerWidth}px` : "60px",
    marginLeft: open ? `${drawerWidth}px` : "-110px",
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
        backgroundColor: "#fff", // **Đổi nền thành trắng**
        color: "#1976D2", // **Chữ màu xanh**
    },
}));

export default function Sidebar({ children }) {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: "Quản lý CTDT", icon: <Topic />, path: "/" },
        { text: "Quản lý khóa học", icon: <Ballot />, path: "/course" },
        { text: "Quản lý lịch dạy", icon: <ScheduleIcon />, path: "/schedule" },
        { text: "Quản lý giờ chuẩn", icon: <AccessTimeIcon />, path: "/time" },
    ];

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
                                            // color: "#1976D2", // **Màu xanh chủ đạo**
                                            // borderRadius: "10px",
                                            color: isActive ? "#fff" : "#1976D2",
                                            backgroundColor: isActive ? "#1976D2" : "transparent",
                                            pointerEvents: isActive ? "none" : "auto", // 👈 không cho click
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: "#1976D2", // **Hover đổi nền thành xanh**
                                                color: "#fff", // **Chữ trắng khi hover**
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
            </DrawerStyled>

            <Main open={open}>
                <Toolbar />
                {children}
            </Main>
        </>
    );
}

