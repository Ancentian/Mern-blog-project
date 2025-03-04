const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//Check Login
const authMiddleware =  (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'Unauthorized'});
    }
};

// GET Admin Login
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with Node JS"
        }
        res.render('admin/login', {locals, layout: adminLayout});   
    } catch (error) {
        console.log(error);
    }
});


router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        
        const user = await User.findOne({username});

        if(!user) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const token = jwt.sign({id: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

//Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with Node JS"
        }

        const posts = await Post.find().sort({createdAt: -1});
        res.render('admin/dashboard', {posts, locals, layout: adminLayout});
    } catch (error) {
        
    }
});


router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({
                username,
                password: hashedPassword
            });
            // res.redirect('/admin');
            console.log(user);
            res.status(201).json({message: 'User created successfully'});
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({message: 'User already exists'});
            } else {
                res.status(500).json({message: 'Error creating user'});
            }
        }
    } catch (error) {
        console.log(error);
    }
});

// Add Post
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with Node JS"
        }
        res.render('admin/add-post', {locals, layout: adminLayout});   
    } catch (error) {
        console.log(error);
    }
});

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        });

        await Post.create(newPost);

        res.redirect('/dashboard');   
    } catch (error) {
        console.log(error);
    }
});

//Edit Post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        const postId = req.params.id.trim(); // Trim spaces
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render('admin/edit-post', { post, layout: adminLayout});   
    } catch (error) {
        console.log(error);
    }
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        
        res.redirect('/edit-post/' + req.params.id);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

router.delete('/logout', authMiddleware, async (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
});

// router.get('/admin', async (req, res) => {
//     try {
//         const locals = {
//             title: "Admin",
//             description: "Simple Blog created with Node JS"
//         }
//         res.render('admin', {locals});   
//     } catch (error) {
//         console.log(error);
//     }
// });
module.exports = router;