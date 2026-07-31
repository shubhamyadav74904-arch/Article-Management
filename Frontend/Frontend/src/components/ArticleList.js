import React from "react";
import { Link } from "react-router-dom";

const ArticleList=({articless})=>(
    <>
    {
    articless.map((article,key)=>(
        
<Link className="article-list-item" key = {key} to={`/articles/${article.name}`}>          
            <h2>{article.name}</h2>
            <p>{article.content[0].substring(0,150)}</p>
        
        </Link>
    ))
}
</>
);

export default ArticleList;
