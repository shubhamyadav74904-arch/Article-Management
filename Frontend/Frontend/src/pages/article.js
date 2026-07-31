import React from "react";
import { Link } from "react-router-dom";
import articles from "./article-content";

const url = process.env.REACT_APP_API_URL || '';

const Article=()=>(
    <>
    {
    articles.map((article,key)=>(
        
<Link className="article-list-item" key = {key} to={`/articles/${article.name}`}>          
            <h2> {article.name}</h2>
            <p>{article.content[0].substring(0,150)}</p>
        
        </Link>
    ))
}
</>
);

export default Article;
