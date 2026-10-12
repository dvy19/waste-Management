const mongoose=require("mongoose")

const centre=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
    },

    name:String,

    address:String,

    coordinates:{
        type:[Number],
    },

    category:String,

    owner:String,

    established:String,

    timing:String,

    description:String
})

const Centre=mongoose.model("Centre" , centre)

module.exports=Centre