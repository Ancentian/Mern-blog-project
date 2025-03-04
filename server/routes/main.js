const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Routes
// Home
router.get('', async (req, res) => {
    const locals = {
        title: "Node JS Blog",
        description: "Simple Blog created with Node JS"
    }

    try {
        let perPage = 5;
        let page = req.query.page || 1;

        const posts = await Post.aggregate([ 
            { $sort: {createdAt: -1} } 
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        
        res.render('index', {locals, posts, 
            current: page, 
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    } 
});

router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;
        const post = await Post.findById({_id: slug});
        
        const locals = {
            title: post.title,
            description: "Simple Blog created with Node JS"
        }
        res.render('post', {locals, post});
    } catch (error) {
        console.log(error);
    }  
});



router.get('/about', (req, res) => {
    res.render('about');
})



router.post('/search', async(req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with Node JS"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const posts = await Post.find({
            $or: [
                {title :  {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body :  {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });
        res.render('search', {locals, posts});
    } catch (error) {
        console.log(error);
    }
})






function insertPostData() {
    Post.insertMany([
        {
            title: "Post One",
            body: "This is post one"
        },
        {
            title: "Post Two",
            body: "This is post two"
        },
        {
            title: "Post Three",
            body: "This is post three"
        }
    ])
    .then(data => console.log(data))
    .catch(err => console.log(err));
}
// insertPostData();
module.exports = router;