// importing React
import React,{ useState,useEffect } from 'react';
import articleContent from '../pages/article-content';
import ArticleList from '../components/ArticleList';
import {useParams} from 'react-router-dom';
import CommentsList from '../components/CommentsList';
import UpvotesSection from '../components/UpvotesSection';
import DownvotesSection from '../components/DownvotesSection';
import AddCommentForm from '../components/AddCommentForm';
const ArticlePage = ()=>{
   // const name = match.params.name;
   const {name} = useParams();
   //console.log(name);
   //const article= articleContent.find((article)=>article.name===name);

   const [articleInfo,setArticleInfo] = useState({upvotes:0,downvotes:0,comments:[]});
   
   useEffect(()=>{
      const fetchData = async ()=>{
        const result = await fetch(`/api/articles/${name}`);  // fetch=> by default get method
        const body = await result.json();
        setArticleInfo(body);
      }
      fetchData();
   },[name]); 


    const article= articleContent.find((article)=>article.name===name);
    if(!article){
    return <h1>Arricle does not exist</h1>;
    }

    const otherArticles = articleContent.filter((article)=>article.name !== name);

    return(
      <>  
        <h1> {article.title} </h1>
          <UpvotesSection articleName={name} upvotes={articleInfo.upvotes} setArticleInfo={setArticleInfo} /> 
          <DownvotesSection articleName={name} downvotes={articleInfo.downvotes} setArticleInfo={setArticleInfo} />    
        {article.content.map((paragraph,key)=>(<p key = {key}>{paragraph}</p>))}
        <CommentsList comments={articleInfo.comments} articleName={name} setArticleInfo={setArticleInfo}/>
        <AddCommentForm articleName={name} setArticleInfo={setArticleInfo}/>
        <ArticleList articless = {otherArticles}/>
      </>  
   )
   
};
export default ArticlePage;
