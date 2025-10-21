import mongoose from 'mongoose';

const userSchema=  new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowarcase:true,
    },
    role:{
        type:String,
        enum:['user','supplier','admin']


    },
    profilePic:{
        type:String,
        default:"", 
    }
},
{timestamps:true});
export default mongoose.model('User',userSchema);