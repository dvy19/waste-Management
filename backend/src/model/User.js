const mong=require("mongoose")

const user=new mong.Schema(
    {

        role:{
            type:String,
            enum:['user']
        },
        
        name:{
            title:String
        },

        email:{
            type:String
        },

        password:{
            type:String
        },

    },

    {
        timestamps:true
    }
)

const User=mong.Schema("User",user)

module.exports=User