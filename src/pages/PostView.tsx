import { API_BASE_URL } from "../config";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// MUI Imports
import {
    Typography,
    Button,
    TextField,
    Paper,
    Box,
    Avatar,
    Stack,
    Divider,
    IconButton,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import ReactMarkdown from "react-markdown";

interface Comment {
    id: number;
    body: string;
    author: string;
    is_pinned: boolean;
}

interface Post {
    id: number;
    title: string;
    body: string;
    author: string;
}

interface PostViewProps {
    currentUser: string;
}

// Generate a consistent color from a string (to be used for Avatar background)
function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
}

// Generate the Avatar props (Color + Initials)
function stringAvatar(name: string) {
    // Split name by space
    const nameParts = name.split(" ");

    // Grab the first letter of the first word
    let initials = nameParts[0][0];

    // If there is a second word, grab its first letter too
    if (nameParts.length > 1) {
        initials += nameParts[1][0];
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: initials.toUpperCase(),
    };
}

const PostView = ({ currentUser }: PostViewProps) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState("");

    // Post Edit State
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editPostTitle, setEditPostTitle] = useState("");
    const [editPostBody, setEditPostBody] = useState("");

    // Comment Edit State
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentBody, setEditCommentBody] = useState("");

    // --- FETCHING ---
    const fetchData = () => {
        fetch(`${API_BASE_URL}/post?id=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setEditPostTitle(data.title);
                setEditPostBody(data.body);
            })
            .catch((err) => console.error(err));

        fetch(`${API_BASE_URL}/comments?post_id=${id}`)
            .then((res) => res.json())
            .then((data) => setComments(data || []))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // --- POST OPERATIONS ---
    const handleUpdatePost = async () => {
        if (!post) return;
        await fetch(`${API_BASE_URL}/posts/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: post.id, title: editPostTitle, body: editPostBody }),
        });
        setIsEditingPost(false);
        fetchData();
    };

    // --- COMMENT OPERATIONS ---
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText) return;

        await fetch(`${API_BASE_URL}/comments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ post_id: Number(id), body: newCommentText }),
        });

        setNewCommentText("");
        fetchData();
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("Delete this comment?")) return;
        await fetch(`${API_BASE_URL}/comments/delete?id=${commentId}`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchData();
    };

    const startEditingComment = (c: Comment) => {
        setEditingCommentId(c.id);
        setEditCommentBody(c.body);
    };

    const saveCommentEdit = async (commentId: number) => {
        await fetch(`${API_BASE_URL}/comments/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: commentId, body: editCommentBody }),
        });
        setEditingCommentId(null);
        fetchData();
    };

    const handlePin = async (commentId: number) => {
        await fetch(`${API_BASE_URL}/comments/pin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ comment_id: commentId }),
        });
        fetchData();
    };

    if (!post) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ pb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            {/* --- MAIN POST CARD --- */}
            <Card variant="outlined" sx={{ mb: 4, padding: 2 }}>
                {isEditingPost ? (
                    // EDIT MODE
                    <Stack spacing={2}>
                        <TextField
                            label="Title"
                            value={editPostTitle}
                            onChange={(e) => setEditPostTitle(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Body"
                            value={editPostBody}
                            onChange={(e) => setEditPostBody(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                        />
                        <Box>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<SaveIcon />}
                                onClick={handleUpdatePost}
                                sx={{ mr: 1 }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<CancelIcon />}
                                onClick={() => setIsEditingPost(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Stack>
                ) : (
                    // VIEW MODE
                    <>
                        <CardContent>
                            <Typography variant="h4" gutterBottom color="primary">
                                {post.title}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Posted by {post.author}
                            </Typography>
                            <Box sx={{ "& p": { m: 0 } }}>
                                {" "}
                                <ReactMarkdown>{post.body}</ReactMarkdown>
                            </Box>
                        </CardContent>

                        {post.author === currentUser && (
                            <CardActions sx={{ justifyContent: "flex-end" }}>
                                <Button startIcon={<EditIcon />} onClick={() => setIsEditingPost(true)}>
                                    Edit Post
                                </Button>
                            </CardActions>
                        )}
                    </>
                )}
            </Card>

            <Divider sx={{ mb: 4 }} />

            {/* --- COMMENTS SECTION --- */}
            <Typography variant="h5" gutterBottom>
                Comments ({comments.length})
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
                {comments.map((c) => (
                    <Paper
                        key={c.id}
                        elevation={1}
                        sx={{
                            p: 2,
                            display: "flex",
                            gap: 2,
                            // PINNED STYLING: Subtle blue tint and border if pinned
                            bgcolor: c.is_pinned ? "rgba(99, 102, 241, 0.08)" : "background.paper",
                            border: c.is_pinned ? "1px solid" : "none",
                            borderColor: "primary.light",
                        }}
                    >
                        {/* Avatar Circle */}
                        <Avatar {...stringAvatar(c.author)} />

                        <Box sx={{ flexGrow: 1 }}>
                            {/* Comment Header */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                {/* Author Name + Pinned Badge */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    {/* PINNED BADGE: Shows if the comment is pinned */}
                                    {c.is_pinned && (
                                        <PushPinIcon
                                            fontSize="small"
                                            color="primary"
                                            sx={{ transform: "rotate(45deg)" }}
                                        />
                                    )}
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        color={c.is_pinned ? "primary" : "textPrimary"}
                                    >
                                        {c.author}
                                    </Typography>
                                </Box>

                                {/* Actions Area */}
                                <Box>
                                    {/* PIN BUTTON: Only visible to the POST AUTHOR */}
                                    {post?.author === currentUser && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handlePin(c.id)}
                                            color="primary"
                                            title={c.is_pinned ? "Unpin" : "Pin to top"}
                                            sx={{ mr: 1 }}
                                        >
                                            {c.is_pinned ? (
                                                <PushPinIcon fontSize="small" />
                                            ) : (
                                                <PushPinOutlinedIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    )}

                                    {/* Edit/Delete Buttons (Only for Comment Author) */}
                                    {c.author === currentUser && editingCommentId !== c.id && (
                                        <>
                                            <IconButton size="small" onClick={() => startEditingComment(c)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteComment(c.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            {/* Comment Body */}
                            {editingCommentId === c.id ? (
                                // Edit Comment Mode
                                <Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        size="small"
                                        value={editCommentBody}
                                        onChange={(e) => setEditCommentBody(e.target.value)}
                                        sx={{ mb: 1, bgcolor: "white" }}
                                    />
                                    <Button size="small" onClick={() => saveCommentEdit(c.id)} sx={{ mr: 1 }}>
                                        Save
                                    </Button>
                                    <Button size="small" color="inherit" onClick={() => setEditingCommentId(null)}>
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                // View Comment Mode
                                <Box sx={{ fontSize: "0.875rem", "& p": { m: 0 } }}>
                                    <ReactMarkdown>{c.body}</ReactMarkdown>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Stack>

            {/* --- ADD COMMENT FORM --- */}
            <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <form onSubmit={handleCommentSubmit}>
                    <TextField
                        fullWidth
                        label="Write a comment..."
                        multiline
                        rows={2}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        sx={{ mb: 2, bgcolor: "white" }}
                    />
                    <Button type="submit" variant="contained">
                        Post Comment
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default PostView;
