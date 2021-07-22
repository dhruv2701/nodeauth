const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true,
        lowecase:true,
        validate(value){
            if (!value || !value.includes('@'))
            throw new Error('email cannot not be empty and must include @')
        }
    },
    username:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        validate(value){
            if (!value)
            throw new Error('Invalid username')
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (!value || value.length < 8)
            throw new Error('Invalid password')
        }
    },
    tokens:[{
            token:{
                type:String, 
                required:true
            }
        }]
})

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async function(username, password){
    const user = await User.findOne({ username });
        if(!user)
        throw new Error('Invalid username/password' )

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Invalid username/password')
        }
        return user
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8);
    next()
})
const User = mongoose.model('user', userSchema)
module.exports = User;
