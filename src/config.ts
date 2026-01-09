// If we are in "production" (online), use the online backend URL.
// We will fill in the "" string later after we deploy the backend.
export const API_BASE_URL =
    process.env.NODE_ENV === "production" ? "https://cvwo-forum-backend.onrender.com" : "http://localhost:8080";
