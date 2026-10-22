// import React from "react";
// import './CommentVote.css'

// const url = process.env.REACT_APP_API_URL || '';

// const CommentVote = ({ comment, articleName, setArticleInfo }) => {
// const upvoteComment = async () => {
//     const result = await fetch(`${url}/api/articles/${articleName}/comments/upvote`, {
//         method: "post",
//         headers: {
//             'Content-Type': "application/json",
//         },
//         body: JSON.stringify({
//             id: comment.id,
//         }),
//     });

//     const body = await result.json();
//     setArticleInfo(body);
// };

// const downvoteComment = async () => {
//     const result = await fetch(`${url}/api/articles/${articleName}/comments/downvote`, {
//         method: "post",
//         headers: {
//             'Content-Type': "application/json",
//         },
//         body: JSON.stringify({
//             id: comment.id,
//         }),
//     });

//     const body = await result.json();
//     setArticleInfo(body);

// };

//     console.log("comment:", comment, articleName, setArticleInfo);

// return (
//     <div className="comment-vote">
//         <button
//             className="vote-btn like-btn"
//             onClick={upvoteComment}
//         >
//             👍 <span>{comment.upvote}</span>
//         </button>

//         <button
//             className="vote-btn dislike-btn"
//             onClick={downvoteComment}
//         >
//             👎 <span>{comment.downvote}</span>
//         </button>
//     </div>
// );
// };

// export default CommentVote;

import React from "react";
import './CommentVote.css'

const url = process.env.REACT_APP_API_URL || '';

const CommentVote = ({ comment, articleName, setArticleInfo }) => {
    const upvoteComment = async () => {
     try {
        const result = await fetch(`${url}/api/articles/${articleName}/comments/upvote`, {
            method: "post",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                id: comment.id,
                username: comment.username,
                text: comment.text,
            }),
        });

        if (!result.ok) {
      const text = await result.text(); 
      throw new Error(`Server error: ${text}`);
    } 
        const body = await result.json();
        console.log("heello", body)
        setArticleInfo(body);
    } catch (err) {
    console.error("Upvote failed:", err);
  }
};

    const downvoteComment = async () => {
        const result = await fetch(`${url}/api/articles/${articleName}/comments/downvote`, {
            method: "post",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                id: comment.id,
                username: comment.username,
                text: comment.text,
            }),
        });

        const body = await result.json();
        setArticleInfo(body);

    };

    // console.log("comment:", comment, articleName, setArticleInfo);

    return (
        <div className="comment-vote">
            <button
                className="vote-btn like-btn"
                onClick={upvoteComment}
            >
                👍 <span>{comment.upvote}</span>
            </button>

            <button
                className="vote-btn dislike-btn"
                onClick={downvoteComment}
            >
                👎 <span>{comment.downvote}</span>
            </button>
        </div>
    );
};

export default CommentVote;
