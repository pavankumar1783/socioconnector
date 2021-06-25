const express=require('express')
const router=express.Router()
const auth=require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator/check')
const User = require('../../models/User')
const bcrypt=require('bcryptjs')

// @route  GET  api/auth
// @desc   Test route
// @access Public
router.get('/' ,auth, async (req,res) => {
    try {
        const user=await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(e) {
        console.error(e)
        res.status(500).send('Server Error')
    }
})


router.post(
    '/' ,
    [
        check('email','Provide valid Email').isEmail(),
        check('password','Password is required').exists() 
    ],
    async (req,res) => {
        // Validate request details
        const errors=validationResult(req) 
        if(!errors.isEmpty()) {
            return res.status(400).json( {errors : errors.array() })
        }

        // See if User Exists
        const { email , password } = req.body
        try {
            let user = await User.findOne({ email })
            if(!user) {
                return res.status(400).json({errors : [{ msg : 'Invalid User Credentials'}]})
            }
            
            const isMatch = await bcrypt.compare(password,user.password)

            if(!isMatch) {
                return res.status(400).json({errors : [{ msg : 'Invalid User Credentials'}]})
            }
             
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

module.exports= router