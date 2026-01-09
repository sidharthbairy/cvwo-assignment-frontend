import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#6366f1", // Vibrant Indigo
            light: "#818cf8",
            dark: "#4338ca",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#ec4899", // Pink/Rose (For accents/hearts)
        },
        background: {
            default: "#f1f5f9", // Cool light grey (Slate-100)
            paper: "#ffffff",
        },
        text: {
            primary: "#1e293b", // Slate-800 (Softer than pure black)
            secondary: "#64748b", // Slate-500
        },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", sans-serif',
        h4: {
            fontWeight: 800, // Extra bold headers
            color: "#1e293b",
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            textTransform: "none", // No all-caps
            fontWeight: 600,
            borderRadius: 8,
        },
    },
    shape: {
        borderRadius: 12, // Rounded corners everywhere
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none", // Flat buttons by default
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)", // Glow effect on hover
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)", // Gradient Button
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Subtle shadow
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)", // Lifts up slightly on hover
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    },
                },
            },
        },
    },
});

export default theme;
