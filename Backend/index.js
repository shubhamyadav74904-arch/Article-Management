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



const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
// const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const Joi = require('joi');
app.use(bodyParser.json());

// // localhost : 3000/api/articles/learn-node
// const withDB = async (operation, res) => {
//     try {
//         const client = await MongoClient.connect(process.env.MONGODB_URL);

//         const db = client.db('my-blog');

//         await operation(db);

//         client.close();

//     } catch (error) {
//         res.status(500).json({ message: `Error: Connecting to DB`, error });

//     }

// }

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");
    } catch (error) {
        app.use((req, res) => {
            res.status(500).json({ message: `Error: Connecting to DB`, error });
        });
    }
})();

// Schema + Model

const commentSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Comment id is required"],
        },

        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },

        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
            minlength: [10, "Comment cannot be empty"],
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },

        upvote: {
            type: Number,
            default: 0,
            min: [0, "Upvote cannot be negative"],
        },

        downvote: {
            type: Number,
            default: 0,
            min: [0, "Downvote cannot be negative"],
        },
    },
    { _id: false }
);


const articleSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Article name is required"], trim: true, minlenght: [3, "Article name must be at least 3 characters"], maxLength: [100, "Article name caannot exceed 100 characters"], },
    upvotes: { type: Number, default: 0, min: [0, "Upvotes cannot be negative"] },
    downvotes: { type: Number, default: 0, min: [0, "Downvotes cannot be negative"], },
    comments: {
        type: [commentSchema],
        default: [],
    },
},
    {
        collection: "articles",
    }
);

const Article = mongoose.model('Article', articleSchema, 'articles');

// schemas 
const getArticleSchema = Joi.object({ name: Joi.string().min(3).required() });
const addCommentSchema = Joi.object({
    username: Joi.string().pattern(/^[A-Za-z\s]+$/).min(3).max(30).required(),
    text: Joi.string().min(5).max(200).required()
});
const voteSchema = Joi.object({ name: Joi.string().min(3).required() });

const commentVoteSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(3).required(),
    text: Joi.string().optional()
});

const commentEditSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(3).required(),
    newText: Joi.string().min(1).max(200).required()
});

const commentDeleteSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(3).required(),
    text: Joi.string().optional()
});

// Middleware function 
const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }
        next();
    };
};

const withDB = async (operation, res) => {
    try {
        await operation();
    } catch (error) {
        res.status(500).json({ message: `Error: running DB operation`, error });
    }
};


// localhost:8000/api/articles/learn-node
// app.get('/api/articles/:name', async (req, res) => {
//     const articleName = req.params.name;
//     withDB(async (db) => {

//         const articlesInfo = await db.collection('articles').findOne({ name: articleName });
//         res.status(200).json(articlesInfo);

//     }, res);

// });

app.get('/api/articles/:name', validate(getArticleSchema, "params"), async (req, res) => {
    const articleName = req.params.name;
    withDB(async () => {
        const articlesInfo = await Article.findOne({ name: articleName });
        res.status(200).json(articlesInfo);
    }, res);
});

// // upvote end-point
// // api/articles/:name/upvote
// app.post('/api/articles/:name/upvote', async (req, res) => {
//     withDB(async (db) => {
//         const articleName = req.params.name;

//         const articlesInfo = await db.collection('articles').findOne({ name: articleName });

//         await db.collection('articles').updateOne({ name: articleName }, {
//             '$set': {
//                 upvotes: articlesInfo.upvotes + 1,
//             }
//         });

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo);

//     }, res);

// });

app.post('/api/articles/:name/upvote', validate(voteSchema, "params"), async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;

        const articlesInfo = await Article.findOne({ name: articleName });

        await Article.updateOne({ name: articleName }, {
            '$set': {
                upvotes: articlesInfo.upvotes + 1,
            }
        });

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);

    }, res);

});

// // downvote end-point
// // api/articles/:name/downvote
// app.post('/api/articles/:name/downvote', async (req, res) => {
//     withDB(async (db) => {
//         const articleName = req.params.name;

//         const articlesInfo = await db.collection('articles').findOne({ name: articleName });

//         await db.collection('articles').updateOne({ name: articleName }, {
//             '$set': {
//                 downvotes: articlesInfo.downvotes + 1,
//             }
//         });

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo);

//     }, res);

// });

app.post('/api/articles/:name/downvote', validate(voteSchema, "params"), async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;

        const articlesInfo = await Article.findOne({ name: articleName });

        await Article.updateOne({ name: articleName }, {
            '$set': {
                downvotes: articlesInfo.downvotes + 1,
            }
        });

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);

    }, res);

});

// // comment end-point
// // api/article/name/add-comment
// app.post('/api/articles/:name/add-comment', (req, res) => {
//     const { username, text } = req.body;
//     const articleName = req.params.name;

//     withDB(async (db) => {
//         const articleInfo = await db.collection('articles').findOne({ name: articleName });
//         await db.collection('articles').updateOne({ name: articleName }, {
//             '$set': {
//                 comments: articleInfo.comments.concat({ id: Date.now().toString(), username, text, "upvote": 0, "downvote": 0 }),
//             }
//         })
//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });
//         res.status(200).json(updatedArticlesInfo);
//     }, res);
// });

app.post('/api/articles/:name/add-comment', validate(addCommentSchema), (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    withDB(async (db) => {
        const articleInfo = await Article.findOne({ name: articleName });
        await Article.updateOne({ name: articleName }, {
            '$set': {
                comments: articleInfo.comments.concat({ id: Date.now().toString(), username, text, "upvote": 0, "downvote": 0 }),
            }
        })
        const updatedArticlesInfo = await Article.findOne({ name: articleName });
        res.status(200).json(updatedArticlesInfo);
    }, res);
});

// comment upvote end point
// app.post("/api/articles/:name/comments/upvote", async (req, res) => {

//     withDB(async (db) => {
//         const articleName = req.params.name;
//         const name = req.body.username;
//         const msg = req.body.text;
//         const id = req.body.id;

//         const articlesInfo = await db.collection('articles').findOne({ name: articleName });



//         const result = await db.collection('articles').updateOne(
//             { name: articleName },
//             { $inc: { "comments.$[elem].upvote": 1 } },
//             { arrayFilters: [{ "elem.id": id }] }
//         );

//         console.log("Update result:", result);

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo);
//     }, res);
// });

app.post("/api/articles/:name/comments/upvote", validate(commentVoteSchema), async (req, res) => {

    withDB(async (db) => {
        const articleName = req.params.name;
        const name = req.body.username;
        const msg = req.body.text;
        const id = req.body.id;

        const articlesInfo = await Article.findOne({ name: articleName });

        await Article.updateOne(
            { name: articleName },
            { $inc: { "comments.$[elem].upvote": 1 } },
            { arrayFilters: [{ "elem.id": id }] }
        );

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);
    }, res);
});

// comment downvote end point
// app.post("/api/articles/:name/comments/downvote", async (req, res) => {
//     withDB(async (db) => {
//         const articleName = req.params.name;
//         const id = req.body.id;
//         const name = req.body.username;
//         const msg = req.body.text;


//         const articlesInfo = await db.collection('articles').findOne({ name: articleName });


//         const result = await db.collection('articles').updateOne(
//             { name: articleName },
//             { $inc: { "comments.$[elem].downvote": 1 } },
//             {
//                 arrayFilters:
//                     [{ "elem.id": id }]
//             }
//         );

//         console.log("Update result:", result);

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo);
//     }, res);
// });

app.post("/api/articles/:name/comments/downvote", validate(commentVoteSchema), async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const id = req.body.id;
        const name = req.body.username;
        const msg = req.body.text;

        const articlesInfo = await Article.findOne({ name: articleName });

        await Article.updateOne(
            { name: articleName },
            { $inc: { "comments.$[elem].downvote": 1 } },
            {
                arrayFilters:
                    [{ "elem.id": id }]
            }
        );

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);
    }, res);
});

// comment edit end point 
// app.post('/api/articles/:name/comments/edit', async (req, res) => {
//     withDB(async (db) => {
//         const articleName = req.params.name;
//         const id = req.body.id;
//         const username = req.body.username
//         const oldText = req.body.oldText;
//         const newText = req.body.newText;

//         await db.collection('articles').updateOne(
//             { name: articleName },
//             {
//                 '$set': {
//                     "comments.$[elem].text": newText
//                 }
//             },
//             {
//                 arrayFilters: [
//                     {
//                         'elem.id': id
//                     }
//                 ]
//             }
//         );

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo)

//     }, res)
// });

app.post('/api/articles/:name/comments/edit', validate(commentEditSchema), async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const id = req.body.id;
        const username = req.body.username
        const oldText = req.body.oldText;
        const newText = req.body.newText;

        await Article.updateOne(
            { name: articleName },
            {
                '$set': {
                    "comments.$[elem].text": newText
                }
            },
            {
                arrayFilters: [
                    {
                        'elem.id': id
                    }
                ]
            }
        );

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo)

    }, res)
});

// comment delete end point
// app.post('/api/articles/:name/comments/delete', async (req, res) => {
//     withDB(async (db) => {
//         const articleName = req.params.name;
//         const id = req.body.id;
//         const username = req.body.username;
//         const text = req.body.text;

//         await db.collection('articles').updateOne(
//             {
//                 name: articleName
//             },
//             {
//                 '$pull': {
//                     comments: {
//                         id: id
//                     },
//                 },
//             }
//         );

//         const updatedArticlesInfo = await db.collection('articles').findOne({ name: articleName });

//         res.status(200).json(updatedArticlesInfo);
//     }, res);

// });

app.post('/api/articles/:name/comments/delete', validate(commentDeleteSchema), async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const id = req.body.id;
        const username = req.body.username;
        const text = req.body.text;

        await Article.updateOne(
            {
                name: articleName
            },
            {
                '$pull': {
                    comments: {
                        id: id
                    },
                },
            }
        );

        const updatedArticlesInfo = await Article.findOne({ name: articleName });

        res.status(200).json(updatedArticlesInfo);
    }, res);

});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});
app.listen(8000, () => console.log('Server is listening on port 8000'));


