import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// MUI Imports
import {
    Typography,
    Button,
    TextField,
    Paper,
    Box,
    Card,
    CardContent,
    CardActions,
    Stack,
    Divider,
} from "@mui/material";

// Icons
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Send as SendIcon } from "@mui/icons-material";

interface Post {
    id: number;
    title: string;
    author: string;
}

interface Topic {
    id: number;
    title: string;
}

// Accept currentUser as a prop
interface TopicViewProps {
    currentUser: string;
}

const TopicView = ({ currentUser }: TopicViewProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [topic, setTopic] = useState<Topic | null>(null);

    // Create Form State
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");

    const fetchPosts = () => {
        fetch(`http://localhost:8080/posts?topic_id=${id}`)
            .then((res) => res.json())
            .then((data) => setPosts(data || []))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchPosts();

        // Fetch Topic Name
        fetch(`http://localhost:8080/topic?id=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Topic not found");
                return res.json();
            })
            .then((data) => setTopic(data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();

        // Backend gets author from session cookie
        const response = await fetch("http://localhost:8080/posts/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                topic_id: Number(id),
                title: newTitle,
                body: newBody,
            }),
        });

        if (response.ok) {
            setNewTitle("");
            setNewBody("");
            fetchPosts();
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm("Are you sure? This will delete all comments too.")) return;

        const response = await fetch(`http://localhost:8080/posts/delete?id=${postId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            fetchPosts();
        } else {
            alert("Failed to delete post. You might not be the owner.");
        }
    };

    return (
        <Box>
            {/* Header & Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mr: 2 }}>
                    Back
                </Button>
                <Typography variant="h4">{topic ? topic.title : "Loading..."}</Typography>
            </Box>

            {/* Create Post Form */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: "#fdfdfd" }}>
                <Typography variant="h6" gutterBottom>
                    Start a New Thread
                </Typography>
                <form onSubmit={handleCreatePost}>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <TextField
                        label="Content"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<SendIcon />}
                            disabled={!newTitle || !newBody}
                        >
                            Post
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Divider sx={{ mb: 4 }} />

            {/* Post List */}
            <Typography variant="h5" sx={{ mb: 2 }}>
                Recent Posts
            </Typography>

            <Stack spacing={2}>
                {posts.length === 0 ? (
                    <Typography color="text.secondary">No posts yet. Be the first!</Typography>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} variant="outlined" sx={{ "&:hover": { boxShadow: 3 } }}>
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    component={Link}
                                    to={`/post/${post.id}`}
                                    sx={{
                                        textDecoration: "none",
                                        color: "primary.main",
                                        fontWeight: "bold",
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    {post.title}
                                </Typography>

                                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                                    Posted by <strong>{post.author}</strong>
                                </Typography>
                            </CardContent>

                            {/* Only show actions if the current user owns the post */}
                            {post.author === currentUser && (
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    ))
                )}
            </Stack>
        </Box>
    );
};

export default TopicView;
