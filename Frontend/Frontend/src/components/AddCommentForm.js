import React, { useState,} from "react";
import $ from "jquery";
//import "jquery-validation";
// import {FaThumbsUp,FaThumbsDown} from "react-icons/fa";
import './AddCommentForm.css';

const url = process.env.REACT_APP_API_URL || '';
const AddCommentForm = ({articleName,setArticleInfo}) =>{
    const [username,setUserName] = useState('');
    const [commentText,setCommentText] = useState('');

    const addComment = async(event)=>{
        event.preventDefault();

        $("#userNameError").text("");
        $("#commentTextError").text("");

        // Name Validation
        if(username.trim() === "") {
           $("#userNameError").text("Please Enter Your Name");
            return;
        }

        if(username.length < 3) {
           $("#userNameError").text("Name must be at least 3 characters long");
           return;
        }
   
        if(!/^[a-zA-Z\s]+$/.test(username)) {
           $("#userNameError").text("Name should only contain letters");
           return;
        }

        //Comment Validation
        if(commentText.trim() === "") {
            $("#commentTextError").text("Please Enter Your Comment");
            return;
        }

        if(commentText.length < 10) {
           $("#commentTextError").text("Comment must be at least 10 characters long");
           return;
        }
    
        if(commentText.length > 200) {
           $("#commentTextError").text("Comment cannot exceed 200 characters");
           return;
        }

        const result = await fetch(`${url}/api/articles/${articleName}/add-comment`,{
            method:'post',
            body:JSON.stringify({username,text:commentText}),
            headers:{
                'Content-Type':'application/json',
            }
        });
        const body = await result.json();
        setArticleInfo(body);
        setUserName('');
        setCommentText('');

        $("#successMessage").text("");

        $("#successMessage")
        .addClass("show")
        .text("Comment added Successfully!");
        setTimeout(() => {
            $("#successMessage")
            .removeClass("show")
            .text(""); 
        },3000);
        
    };

    return(
        <form id="Form" onSubmit={addComment}>
            <div class='Div'>
            <h3 style={{ marginBottom:'18px',color:"black"}}>Add a Comment:</h3>
            <label htmlFor="username">
               <b> Name :</b>
                <br/>
                <input class="name" type="text" value={username} onChange={(event)=>setUserName(event.target.value)}/> 
                <span id="userNameError" className="error"></span>
            </label>
            <br/>
            <label htmlFor="commentText">
                <b>Comment :</b>
            <br/>    
                <textarea class="textarea" rows="4" cols="50" value={commentText} onChange={(event)=>setCommentText(event.target.value)}></textarea>
                <span id="commentTextError" className="error"></span>
            </label>
            <br/>
            <button class="Button" type="submit"><b>Add Comment</b></button>
            <div id="successMessage" className="success"></div>
            </div>
        </form>  
    );
}
export default AddCommentForm;
