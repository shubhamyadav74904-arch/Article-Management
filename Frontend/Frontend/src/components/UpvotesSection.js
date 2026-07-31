import React from 'react';
import styles from './UpvotesSection.module.css';

const url = process.env.REACT_APP_API_URL || ''; 
console.log(url)

const UpvotesSection = ({articleName,upvotes,setArticleInfo})=>{
    const upvoteArticle = async ()=>{
        const result = await fetch(`${url}/api/articles/${articleName}/upvote`,{    
            method:'post',
        });

        const body = await result.json();
        setArticleInfo(body);
    }   
    
    return(
        <span>
            <h4>✨ Did You Enjoy this article ?</h4>
            <button class={styles.Button} onClick={()=>upvoteArticle()}><b>👍{upvotes}</b></button>   
        </span> 
    )              
};
export default UpvotesSection;
