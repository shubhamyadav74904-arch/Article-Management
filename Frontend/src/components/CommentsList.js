import React from 'react';
import styles from './CommentsList.module.css';
// import { MdPadding } from 'react-icons/md';
import Comment from './Comment';
const CommentsList = ({comments,articleName, setArticleInfo})=>(
  // return(
    <>
      <h3>Comments:</h3>
      {
        comments.map((comment,key)=>(
            <div className={styles.comment} key={key}>
                {/* <h4>{comment.username}</h4>
                <p>{comment.text}</p> */}
                <Comment
                    key={comment.id}
                    comment={comment}
                    articleName={articleName}
                    setArticleInfo={setArticleInfo}
                />
            </div>
        ))
      }
    </>
   )
// }
export default CommentsList;