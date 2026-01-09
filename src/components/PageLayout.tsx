import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
    currentUser: string | null;
    onLogout: () => void;
}

const Layout = ({ children, currentUser, onLogout }: LayoutProps) => {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            {/* UPDATED APP BAR */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                    backdropFilter: "blur(20px)", // "Frosted glass" effect
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
            >
                <Toolbar>
                    {/* Brand Logo with Gradient Text */}
                    <Typography
                        variant="h5"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            fontWeight: 900,
                            letterSpacing: "-1px",
                            // Text Gradient Logic:
                            background: "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Web Forum
                    </Typography>

                    {/* Navigation Buttons */}
                    {currentUser ? (
                        <>
                            <Typography variant="body2" sx={{ mr: 2, color: "text.secondary", fontWeight: 600 }}>
                                Hello, {currentUser}
                            </Typography>
                            <Button variant="outlined" color="primary" onClick={onLogout} size="small">
                                Logout
                            </Button>
                        </>
                    ) : null}
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 5, pb: 10 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
