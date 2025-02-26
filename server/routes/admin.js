const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

const adminLayout = '../views/layouts/admin';

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