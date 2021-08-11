const mongoose=require('mongoose')

const userSchema = new mongoose.Schema( {
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        select: false
    },
    password : {
        type : String,
        required : true,
    },
    avatar : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now,
        select: false
    }
})

module.exports = User = mongoose.model('user',userSchema)
