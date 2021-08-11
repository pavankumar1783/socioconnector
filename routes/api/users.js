const express=require('express')
const bcrypt = require('bcryptjs')
const router=express.Router()
const gravatar=require('gravatar')
const jwt = require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

// @route  Post  api/users  
// @desc   Register users
// @access Public

router.post(
    '/' ,
    [
        check('name','Name is required').not().isEmpty(),
        check('email','Provide valid Email').isEmail(),
        check('password','Password must be 6 or more characters').isLength({min : 6})
    ],
    async (req,res) => {
        // Validate request details
        const errors=validationResult(req) 
        if(!errors.isEmpty()) {
            return res.status(400).json( {errors : errors.array() })
        }

        // See if User Exists
        const { name, email , password } = req.body
        try {
            let user = await User.findOne({ email })
            if(user) {
                return res.status(400).json({errors : [{ msg : 'User Already Exists'}]})
            }
            // Get Users gravatar
            const avatar = gravatar.url(email , {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                password,
                avatar
            })

            // Encrypt  Password
            user.password= await bcrypt.hash(user.password,10) 
            await user.save()


            // Return JSONWEBTOKEN
            const payload = {
                user : {
                    id : user.id
                }
            }

            jwt.sign(payload,config.get('jwtSecret'),{expiresIn : 360000},(err,token) => {
                if(err) throw err
                return res.json({ token })
            })

            //res.send('User Registered')

        } catch (e) {
             console.error(err.message)
             res.status(500).send('Server Error')
        }
    }
)

//GET ALL USERS
router.get('/', auth, async (req,res) => {
    try {
        const users=await User.find().select('-password')
        return res.json(users)
    } catch (e) {
        console.log(e.message)
        res.status(500).send('Server Error')
    }
} )

//GET Users by Usernames
router.get('/:name', auth, async (req,res) => {
    try{
        const x= req.params.name
        const users = await User.find({name: { $regex: '.*' + x + '.*', $options:"i" } })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        if(users.length>0)
            return res.json(users)
        res.status(400).json({msg : 'Users not Found'})
    } catch(e) {
        res.status(500).send('Server Error')
    }
})

module.exports= router