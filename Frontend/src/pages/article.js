import React from "react";
import { Link } from "react-router-dom";
import articles from "./article-content";

const Article=()=>(
    <>
    {
    articles.map((article,key)=>(
        
        <Link className="article-list-item" key = {key} to={`/article/${article.name}`}>
          
            <h2> {article.name}</h2>
            <p>{article.content[0].substring(0,150)}</p>
        
        </Link>
    ))
}
</>
);

export default Article;
