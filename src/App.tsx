import Home from "./pages/Home";
import TopicView from "./pages/TopicView";
import PostView from "./pages/PostView";
import Login from "./pages/Login";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

// MUI Imports
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in (validate session)
    useEffect(() => {
        fetch("http://localhost:8080/validate", { credentials: "include" })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Not logged in");
            })
            .then((data) => {
                setCurrentUser(data.username);
                setIsLoading(false);
            })
            .catch(() => {
                setCurrentUser(null);
                setIsLoading(false);
                // Only redirect if we are not already on the login page
                if (location.pathname !== "/login") {
                    navigate("/login");
                }
            });
    }, [location.pathname, navigate]);

    const handleLogout = async () => {
        await fetch("http://localhost:8080/logout", { credentials: "include" });
        setCurrentUser(null);
        navigate("/login");
    };

    // Show Loading Spinner while checking auth
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <CssBaseline />

            {/* Navbar - Only show if LOGGED IN */}
            {currentUser && (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                                Web Forum
                            </Link>
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body1">
                                Hello, <strong>{currentUser}</strong>
                            </Typography>
                            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            {/* Main Content Area */}
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    {currentUser ? (
                        <>
                            <Route path="/" element={<Home currentUser={currentUser} />} />
                            <Route path="/topic/:id" element={<TopicView currentUser={currentUser} />} />
                            <Route path="/post/:id" element={<PostView currentUser={currentUser} />} />
                        </>
                    ) : (
                        // If not logged in, any other route redirects to login
                        <Route path="*" element={<Login />} />
                    )}
                </Routes>
            </Container>
        </>
    );
}

export default App;
