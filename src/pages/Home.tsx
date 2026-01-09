import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// MUI Imports
import {
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Paper,
    Divider,
} from "@mui/material";

// Icons
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { API_BASE_URL } from "../config";

interface Topic {
    id: number;
    title: string;
    author: string;
}

// Accept currentUser as a prop
interface HomeProps {
    currentUser: string;
}

const Home = ({ currentUser }: HomeProps) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopicTitle, setNewTopicTitle] = useState("");
    const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const fetchTopics = () => {
        fetch(`${API_BASE_URL}/topics`)
            .then((res) => res.json())
            .then((data) => setTopics(data || []))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicTitle) return;

        // Backend uses the cookie to determine the author, so just send the title
        await fetch(`${API_BASE_URL}/topics/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: newTopicTitle }),
        });

        setNewTopicTitle("");
        fetchTopics();
    };

    const handleDeleteTopic = async (id: number) => {
        if (!window.confirm("WARNING: Deleting this topic will delete ALL posts inside it!")) return;

        await fetch(`${API_BASE_URL}/topics/delete?id=${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchTopics();
    };

    const startEditing = (topic: Topic) => {
        setEditingTopicId(topic.id);
        setEditTitle(topic.title);
    };

    const saveEdit = async () => {
        if (!editingTopicId) return;
        await fetch(`${API_BASE_URL}/topics/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: editingTopicId, title: editTitle }),
        });
        setEditingTopicId(null);
        fetchTopics();
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Forum Topics
            </Typography>

            {/* CREATE SECTION */}
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4, display: "flex", gap: 2 }}>
                <TextField
                    label="New Topic Name"
                    variant="outlined"
                    fullWidth
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    size="small"
                />
                <Button variant="contained" onClick={handleCreateTopic} disabled={!newTopicTitle}>
                    Add
                </Button>
            </Paper>

            {/*THE LIST */}
            <Paper elevation={1}>
                <List>
                    {topics.map((topic, index) => (
                        <React.Fragment key={topic.id}>
                            {editingTopicId === topic.id ? (
                                // --- EDIT MODE ---
                                <ListItem>
                                    <TextField
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        fullWidth
                                        size="small"
                                        autoFocus
                                    />
                                    <IconButton onClick={saveEdit} color="success">
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setEditingTopicId(null)} color="default">
                                        <CancelIcon />
                                    </IconButton>
                                </ListItem>
                            ) : (
                                // --- VIEW MODE ---
                                <ListItem
                                    disablePadding
                                    secondaryAction={
                                        // Only show buttons if the logged-in user is the author
                                        topic.author === currentUser && (
                                            <>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="edit"
                                                    onClick={() => startEditing(topic)}
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    color="error"
                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )
                                    }
                                >
                                    <ListItemButton component={Link} to={`/topic/${topic.id}`}>
                                        <ListItemText
                                            primary={topic.title}
                                            primaryTypographyProps={{ variant: "h6", color: "primary" }}
                                            // Show the author in smaller text below the title
                                            secondary={`Created by ${topic.author || "Unknown"}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {index < topics.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </div>
    );
};

export default Home;
