// import express from express;
// import bodyParser from 'body-parser';
// const express = require('express');
// const bodyParser = require('body-parser');
// const {MongoClient} = require('mongodb');
// const app = express();
// const 

// const articlesInfo = {
//     'learn-react':{
//         upvotes:0,
//         Comments:[]
//     },
//     'learn-node':{
//         upvotes:0,
//          Comments:[]
//     },
//     'my-thoughts-on-resumes':{
//         upvotes:0,
//          Comments:[]
//     }
// }
// app.use(bodyParser.json());
// app.use(express.json());

// app.get('/hello',(req,res)=> res.send('Hi From Express Server'));
/* app.get('/hello/:name',(req,res)=> res.send(`Hi ${req.params.name}`));
app.post('/hello_name',(req,res)=> res.send(`Hello ${req.body.name}`)); */

// localhost:8000/api/articles/:name/upvotes'
/*
app.post('/api/articles/:name/upvotes',(req,res)=>{
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes += 1;
res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`);
});


app.post('/api/articles/:name/add-comment',(req,res)=>{
    const {username,text}=req.body;
    const articleName = req.params.name;
    
articlesInfo[articleName].Comments.push({username,text});
   // res.send('Comment Updated');
   res.status(200).send(articlesInfo[articleName]);
});      */




const express = require('express');
   const bodyParser = require('body-parser');
   const {MongoClient} = require('mongodb');
   const cors = require('cors');
   const app = express();

   app.use(cors());
const dns = require('dns');
dns.setServers(['8.8.8.8','8.8.4.4']);

app.use(bodyParser.json());

// localhost : 3000/api/articles/learn-node
const withDB = async(operation,res)=>{
    try{
         const client = await MongoClient.connect('mongodb+srv://shubhamyadav74904_db_user:shubh969645@cluster0.ghaa951.mongodb.net/?appName=Cluster0');

         const db = client.db('my-blog');

         await operation(db);

         client.close();
        
    }catch(error){
        res.status(500).json({message:`Error: Connecting to DB`,error});

    }
   
}
// localhost:8000/api/articles/learn-node
app.get('/api/articles/:name', async (req,res)=>{
    const articleName = req.params.name;
    withDB(async (db)=>{
          
          const articlesInfo = await db.collection('articles').findOne({name:articleName});
          res.status(200).json(articlesInfo);
       
    },res);
      
});


// upvote end-point
// api/articles/:name/upvote
app.post('/api/articles/:name/upvote', async (req,res)=>{
        withDB(async(db)=>{
            const articleName = req.params.name;

           const articlesInfo = await db.collection('articles').findOne({name:articleName});
        
           await db.collection('articles').updateOne({name:articleName},{
            '$set':{
                upvotes:articlesInfo.upvotes + 1,
            }
        });
        
        const updatedArticlesInfo = await db.collection('articles').findOne({name:articleName});

        res.status(200).json(updatedArticlesInfo);

        },res); 
       
});

// downvote end-point
// api/articles/:name/downvote
app.post('/api/articles/:name/downvote', async (req,res)=>{
        withDB(async(db)=>{
            const articleName = req.params.name;

           const articlesInfo = await db.collection('articles').findOne({name:articleName});
        
           await db.collection('articles').updateOne({name:articleName},{
            '$set':{
                downvotes:articlesInfo.downvotes + 1,
            }
        });
        
        const updatedArticlesInfo = await db.collection('articles').findOne({name:articleName});

        res.status(200).json(updatedArticlesInfo);

        },res); 
       
});

// comment end-point
// api/article/name/add-comment
app.post('/api/articles/:name/add-comment',(req,res)=>{
    const {username,text} = req.body;
    const articleName = req.params.name;
    
    withDB(async(db)=>{
        const articleInfo = await db.collection('articles').findOne({name:articleName});
        await db.collection('articles').updateOne({name:articleName},{
            '$set' : {
                comments : articleInfo.comments.concat({id: Date.now().toString(), username, text, "upvote": 0, "downvote": 0 }),
            }
        })
        const updatedArticlesInfo = await db.collection('articles').findOne({name:articleName});
        res.status(200).json(updatedArticlesInfo);
    },res);
});

// comment upvote end point
app.post("/api/articles/:name/comments/upvote", async (req, res) => {

    withDB(async (db) => {
        const articleName = req.params.name;
        const name = req.body.username;
        const msg = req.body.text;
        const id = req.body.id;
       
        const articlesInfo = await db.collection('articles').findOne({ name: articleName });
    
       

const result = await db.collection('articles').updateOne(
    { name: articleName },
    { $inc: { "comments.$[elem].upvote": 1 } },
    { arrayFilters: [{ "elem.id":id }] }
);

console.log("Update result:", result);

        const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);
    }, res);
});

// comment downvote end point
app.post("/api/articles/:name/comments/downvote", async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const id = req.body.id;
        const name = req.body.username;
        const msg = req.body.text;

        
        const articlesInfo = await db.collection('articles').findOne({ name: articleName });


const result = await db.collection('articles').updateOne(
    { name: articleName },
    { $inc: { "comments.$[elem].downvote": 1 } },
    { arrayFilters: 
        [{ "elem.id":id }]
     }
);

console.log("Update result:", result);

        const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);
    }, res);
});

// comment edit end point 
app.post('/api/articles/:name/comments/edit',async(req,res)=>{
    withDB(async(db)=>{
        const articleName = req.params.name;
        const id = req.body.id;
        const username = req.body.username
        const oldText = req.body.oldText;
        const newText = req.body.newText;

        await db.collection('articles').updateOne(
            {name:articleName},
            {
                '$set':{
                    "comments.$[elem].text":newText
                }
            },
            {
                arrayFilters:[
                    {
                        'elem.id':id
                    }
                ]
            }
        );

        const updatedArticlesInfo = await db.collection('articles').findOne({name:articleName});

        res.status(200).json(updatedArticlesInfo)

    },res)
});


// comment delete end point

app.post('/api/articles/:name/comments/delete',async(req,res)=>{
    withDB(async(db)=>{
        const articleName = req.params.name;
        const id = req.body.id;
        const username = req.body.username;
        const text = req.body.text;

        await db.collection('articles').updateOne(
            {
                name:articleName
            },
            {
                '$pull':{
                    comments:{
                        id:id
                    },
                },
            }
        );

        const updatedArticlesInfo = await db.collection('articles').findOne({name:articleName});

        res.status(200).json(updatedArticlesInfo);
    },res);

});
app.listen(8000,()=>console.log('Server is listening on port 8000'));
