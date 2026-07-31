import React from "react";
import CommentVote from "./CommentVote";
import { useState } from "react";
import "./Comment.css";

const url = process.env.REACT_APP_API_URL || '';

const Comment = ({ comment, articleName, setArticleInfo }) => {
    const [IsEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const saveComment = async () => {

        if (editedText.trim() === "") {
            alert("Comment cannot be empty");
            return;
        }
        const result = await fetch(`${url}/api/articles/${articleName}/comments/edit`, {
            method: 'POST',
            headers: {
                "Content-Type": 'Application/json',
            },
            body: JSON.stringify({
                id: comment.id,
                newText: editedText,
            }),
        }
        );

        const body = await result.json();
        setArticleInfo(body);
        setIsEditing(false);
    };

    const deleteComment = async () => {

        const result = await fetch(`${url}/api/articles/${articleName}/comments/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: comment.id
            }),
        });
        const body = await result.json();
        setArticleInfo(body)
    };

   return (
    <div className="comment">

        <div className="comment-header">
            <div className="avatar">
                {comment.username.charAt(0).toUpperCase()}
            </div>

            <h4>{comment.username}</h4>
        </div>

        {IsEditing ? (
            <>
                <p className="edit-label">✏️ Editing Comment</p>

                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="edit-textarea"
                />

                <div className="edit-actions">

                    <button
                        className="save-btn"
                        onClick={saveComment}
                    >
                        💾 Save
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={() => {
                            setEditedText(comment.text);
                            setIsEditing(false);
                        }}
                    >
                        ❌ Cancel
                    </button>

                </div>
            </>
        ) : (
            <>
                <p>{comment.text}</p>

                <div className="comment-footer">

                    <div className="comment-actions">

                        <button
                            className="edit-btn"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setIsEditing(true);
                            }}
                        >
                            ✏️ Edit
                        </button>

                        <button
                            className="delete-btn"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            🗑️ Delete
                        </button>

                    </div>

                    <CommentVote
                        comment={comment}
                        articleName={articleName}
                        setArticleInfo={setArticleInfo}
                    />

                </div>

                {showDeleteConfirm && (
                    <div className="delete-confirm">

                        <p>⚠️ Delete this comment?</p>

                        <div className="delete-confirm-actions">

                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                ❌ Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={deleteComment}
                            >
                                🗑️ Delete
                            </button>

                        </div>

                    </div>
                )}

            </>
        )}

    </div>
);
};

export default Comment;
