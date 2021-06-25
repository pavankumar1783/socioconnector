const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator/check')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')


// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
    '/',
    [ 
        auth,
        [
            check('text','Text is Required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()})
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = new Post({
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user : req.user.id
            })
            const post = await newPost.save()
            res.json(post)
        } catch (e) {
            console.error(e.message)
            res.status(500).send('Server Error')
        }
        
    }
)

// PRIVATE GET All Posts

router.get('/', auth ,async (req,res) => {
    try {
        const posts = await Post.find().sort({date : -1})
        res.json(posts)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
    }
})

// PRIVATE GET a Post by ID 

router.get('/:id', auth , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json({msg : 'Post Not Found'})
        res.json(post)
    } catch (e) {
        console.error(e.message)
        if(e.kind == 'ObjectId') return res.status(404).json({msg : 'Post Not Found'})
        res.status(500).send('Server Error')
    }
})

//PRIVATE DELETE POST by ID 
router.delete('/:id', auth , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json({msg : 'Post Not Found'})
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'User not Authorized'})
        }
        await post.remove()
        res.send('Post Removed')
    } catch (e) {
        console.error(e.message)
        if(e.kind == 'ObjectId') return res.status(404).json({msg : 'Post Not Found'})
        res.status(500).send('Server Error')
    }
})

// Private LIKE a Post 
router.put('/like/:id', auth , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg : 'Post Already Liked'})
        } 
        post.likes.unshift({user : req.user.id})
        await post.save()
        return res.json(post.likes)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
        
    }
})

//Private Unlike a Post 
router.put('/unlike/:id' , auth , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg : 'Post Not Yet Liked'})
        } 
       
        const removeIndex=post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1)
        await post.save()
        return res.json(post.likes)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
        
    }
})

//PRIVATE Add a Comment on a post
router.post(
    '/comment/:id',
    [ 
        auth,
        [
            check('text','Text is Required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()})
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            const newComment = {
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user : req.user.id
            }
            post.comments.unshift(newComment)
            await post.save()
            res.json(post.comments)
        } catch (e) {
            console.error(e.message)
            res.status(500).send('Server Error')
        }
        
    }
)

//PRIVATE Delete a comment on a post 
router.delete('/comment/:id/:comment_id' , auth , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id===req.params.comment_id)
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'})
        }
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'Unauthorized user'})
        }
        const removeIndex=post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex,1)
        await post.save()
        return res.json(post.comments)


    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;
