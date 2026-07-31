import React from 'react';
import styles from './DownvotesSection.module.css';

const url = process.env.REACT_APP_API_URL || '';

const DownvotesSection = ({articleName,downvotes,setArticleInfo})=>{
    const downvoteArticle = async ()=>{
        const result = await fetch(`${url}/api/articles/${articleName}/downvote`,{    
            method:'post',
        });

        const body = await result.json();
        setArticleInfo(body);
    }   
    
    return(
        <span>
             <button class={styles.Button} onClick={()=>downvoteArticle()}><b>👎{downvotes}</b></button>    
        </span> 
    )              
};
export default DownvotesSection;
