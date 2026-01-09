import Home from "./pages/Home";
import TopicView from "./pages/TopicView";
import PostView from "./pages/PostView";
import Login from "./pages/Login";
import theme from "./theme";
import PageLayout from "./components/PageLayout";
import { API_BASE_URL } from "./config";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// MUI Imports
import { CssBaseline, Box, CircularProgress, ThemeProvider } from "@mui/material";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in (validate session)
    useEffect(() => {
        fetch(`${API_BASE_URL}/validate`, { credentials: "include" })
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
        await fetch(`${API_BASE_URL}/logout`, { credentials: "include" });
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Main Content Area */}
            <PageLayout currentUser={currentUser} onLogout={handleLogout}>
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
            </PageLayout>
        </ThemeProvider>
    );
}

export default App;
