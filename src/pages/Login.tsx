import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Link } from "@mui/material";

const Login = () => {
    // STATE VARIABLES
    const [isRegistering, setIsRegistering] = useState(false); // Default is Login mode
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Determine if the user is logging in or registering
        const endpoint = isRegistering ? "register" : "login";

        try {
            const response = await fetch(`http://localhost:8080/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                window.location.href = "/";
            } else {
                const text = await response.text();
                setError(text || "Authentication failed");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Is the backend running?");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Paper elevation={3} sx={{ p: 4, width: "100%", textAlign: "center" }}>
                    {/* DYNAMIC HEADER */}
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        {isRegistering ? "Create Account" : "Sign In"}
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* SUBMIT BUTTON */}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {isRegistering ? "Sign Up" : "Sign In"}
                        </Button>

                        {/* THE TOGGLE LINK (SIGN IN / SIGN UP) */}
                        <Box sx={{ mt: 1 }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsRegistering(!isRegistering); // Switches the mode
                                    setError(""); // Clear old errors
                                }}
                            >
                                {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
